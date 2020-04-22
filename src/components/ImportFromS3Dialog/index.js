// @flow weak
import React, { useState, useEffect, useRef } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import Radio from "@material-ui/core/Radio"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Amplify, { Storage } from "aws-amplify"
import isEmpty from "../../utils/isEmpty"
import { setIn } from "seamless-immutable"
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"

const expandedDataColumns = [
  { name: "Data", selector: "data", sortable: true },
  { name: "Last Modified", selector: "lastModified", sortable: true },
]

const expandedAnnotationsColumns = [
  { name: "Annotations", selector: "annotation" },
  { name: "Last Modified", selector: "lastModified", sortable: true },
]

const columns = [{ name: "Projects", selector: "folder", sortable: true }]

const customStyles = {
  headCells: {
    style: {
      paddingLeft: "10px",
    },
  },
  cells: {
    style: {
      paddingLeft: "25px",
    },
  },
}

const ExpandedRow = ({ data }) => {
  const { rowData, rowAnnotations, ...notImportant } = data
  return (
    <>
      <DataTable
        style={{
          boxSizing: "border-box",
          paddingLeft: "50px",
          paddingRight: "10px",
        }}
        dense
        striped
        noHeader
        columns={expandedAnnotationsColumns}
        data={rowAnnotations}
        noDataComponent='Make sure the project has "annotations" folder'
        pagination={rowData.length > 10}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        customStyles={customStyles}
      />
      <DataTable
        style={{
          boxSizing: "border-box",
          paddingLeft: "50px",
          paddingRight: "10px",
        }}
        dense
        striped
        noHeader
        columns={expandedDataColumns}
        data={rowData}
        noDataComponent={'Make sure the project has "data" folder'}
        pagination={rowData.length > 10}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        customStyles={customStyles}
      />
    </>
  )
}

export default ({ file, open, onClose, onAddSamples, authConfig, user }) => {
  Amplify.configure(authConfig)
  const [s3Content, changeS3Content] = useState(null)
  const [dataForTable, changeDataForTable] = useState(null)
  const [folderToFetch, setFolderToFetch] = useState("")
  const [configImport, setConfigImport] = useState({
    annotationToKeep: "both",
    typeOfFileToLoad:
      file.content.interface.type === "image_classification" ||
      file.content.interface.type === "image_segmentation" ||
      file.content.interface.type === "" ||
      isEmpty(file.content.interface)
        ? "Image"
        : file.content.interface.type === "video_segmentation"
        ? "Video"
        : "None",
    typeOfFileToDisable: {
      Image:
        file.content.interface.type === "image_classification" ||
        file.content.interface.type === "image_segmentation" ||
        file.content.interface.type === "" ||
        isEmpty(file.content.interface)
          ? false
          : true,
      Video:
        file.content.interface.type === "video_segmentation" ||
        file.content.interface.type === "" ||
        isEmpty(file.content.interface)
          ? false
          : true,
      Audio: true,
    },
  })
  let _dataForTable = {}

  async function GetImageFromAFolderAWS(result) {
    var samples = []
    for (let i = 0; i < result.length; i++) {
      if (result[i].key.match(`(${folderToFetch}/data).*(\\.).*`)) {
        await Storage.get(result[i].key, {
          expires: 24 * 60 * 60 * 2000,
          level: "private",
        })
          .then((result) => {
            if (
              RecognizeFileExtension(result) ===
                configImport.typeOfFileToLoad &&
              configImport.typeOfFileToLoad === "Image"
            ) {
              samples.push({ imageUrl: `${result}` })
            } else if (
              RecognizeFileExtension(result) ===
                configImport.typeOfFileToLoad &&
              configImport.typeOfFileToLoad === "Video"
            ) {
              samples.push({ videoUrl: `${result}` })
            }
          })
          .catch((err) => {
            console.log("error getting link for s3 image", err)
            return null
          })
      }
    }
    return samples
  }

  async function GetAnnotationFromAFolderAWS(result) {
    var json = null
    if (
      result.find(
        (element) =>
          element.key === `${folderToFetch}/annotations/annotations.json`
      )
    ) {
      await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
        expires: 24 * 60 * 60 * 2000,
        level: "private",
      })
        .then(async (result) => {
          await fetch(result).then(async (data) => {
            return await data.json().then(async (result) => {
              if (typeof result.content != "undefined") {
                json = result
              }
            })
          })
        })
        .catch((err) => {
          console.log("error getting link for s3 image", err)
          return null
        })
    }
    return json
  }
  const handleAddSample = async () => {
    var samples = await GetImageFromAFolderAWS(s3Content)
    var json = await GetAnnotationFromAFolderAWS(s3Content)
    if (json === null || typeof json.content.taskOutput === "undefined") {
      onAddSamples(samples, null, json, configImport)
    } else {
      onAddSamples(samples, json.content.taskOutput, json, configImport)
    }
  }

  const handleRowSelected = (whatsChanging) => {
    if (!isEmpty(whatsChanging.selectedRows[0])) {
      setFolderToFetch(whatsChanging.selectedRows[0].folder)
      changeDataForTable((prevState) =>
        prevState.map((row) => {
          if (whatsChanging.selectedRows[0].id === row.id) {
            row.isSelected = true
          } else {
            row.isSelected = false
          }
          return row
        })
      )
    } else {
      setFolderToFetch(null)
      changeDataForTable((prevState) =>
        prevState.map((row) => {
          row.isSelected = false
          return row
        })
      )
    }
  }

  useEffect(() => {
    if (isEmpty(user)) {
      changeS3Content(null)
    } else if (!isEmpty(authConfig)) {
      Storage.list("", { level: "private" })
        .then((result) => {
          changeS3Content(result)
          _dataForTable = result
            .filter((obj) => {
              return obj.key.endsWith("/") & (obj.key.split("/").length === 2)
            })
            .map((obj, index) => {
              const folder = obj.key.split("/")[0]
              const rowDataContent = result
                .filter((obj) => {
                  return (
                    obj.key.startsWith(`${folder}/data/`) &
                    !obj.key.endsWith("/")
                  )
                })
                .map((obj) => {
                  return {
                    data: obj.key.split("/data/")[1],
                    lastModified: obj.lastModified.toDateString(),
                  }
                })
              const rowAnnotationsContent = result
                .filter((obj) => {
                  return (
                    obj.key.startsWith(`${folder}/annotations/`) &
                    !obj.key.endsWith("/")
                  )
                })
                .map((obj) => {
                  return {
                    annotation: obj.key.split("/annotations/")[1],
                    lastModified: obj.lastModified.toDateString(),
                  }
                })
              return {
                id: `${index}`,
                folder: folder,
                rowData: rowDataContent,
                rowAnnotations: rowAnnotationsContent,
                isSelected: true,
              }
            })
          changeDataForTable(_dataForTable)
        })
        .catch((err) => console.log(err))
    }
  }, [user])
  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            handleAddSample()
          },
        },
      ]}
    >
      {!isEmpty(dataForTable) && (
        <DataTable
          expandableRows
          expandableRowsComponent={<ExpandedRow />}
          selectableRows
          selectableRowsHighlight
          selectableRowsNoSelectAll
          selectableRowsComponent={Radio}
          dense
          noHeader
          noTableHead
          columns={columns}
          onSelectedRowsChange={handleRowSelected}
          selectableRowSelected={(row) => row.isSelected}
          data={dataForTable}
          pagination={dataForTable.length > 10}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        />
      )}
      <table>
        <tbody>
          <tr>
            <th>
              <FormControl component="fieldset">
                <FormLabel component="legend">Annotation processing</FormLabel>
                <RadioGroup
                  aria-label="option1"
                  name="option1"
                  defaultValue={configImport.annotationToKeep || "both"}
                  onChange={(event) => {
                    setConfigImport({
                      ...configImport,
                      annotationToKeep: event.target.value,
                    })
                  }}
                >
                  <FormControlLabel
                    value="both"
                    control={<Radio />}
                    label="Keep both annotations"
                  />
                  <FormControlLabel
                    value="incoming"
                    control={<Radio />}
                    label="Keep incoming annotations"
                  />
                  <FormControlLabel
                    value="current"
                    control={<Radio />}
                    label="Keep current annotations"
                  />
                </RadioGroup>
              </FormControl>
            </th>
            <th>
              <FormControl component="fieldset">
                <FormLabel component="legend">Choose file type</FormLabel>
                <RadioGroup
                  aria-label="option2"
                  name="option2"
                  defaultValue={configImport.typeOfFileToLoad || "None"}
                  onChange={(event) => {
                    setConfigImport({
                      ...configImport,
                      typeOfFileToLoad: event.target.value,
                    })
                  }}
                >
                  <FormControlLabel
                    value="Image"
                    control={<Radio />}
                    label="Load image file"
                    disabled={configImport.typeOfFileToDisable.Image}
                  />
                  <FormControlLabel
                    value="Video"
                    control={<Radio />}
                    label="Load video file"
                    disabled={configImport.typeOfFileToDisable.Video}
                  />
                  <FormControlLabel
                    value="Audio"
                    control={<Radio />}
                    label="Load audio file"
                    disabled={configImport.typeOfFileToDisable.Audio}
                  />
                </RadioGroup>
              </FormControl>
            </th>
          </tr>
        </tbody>
      </table>
    </SimpleDialog>
  )
}
