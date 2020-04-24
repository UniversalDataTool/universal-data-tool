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
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import { useLocalStorage } from "react-use"
import fileHasChanged from "../../utils/fileHasChanged"
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
import Button from "@material-ui/core/Button"

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

function interfaceFileType(type) {
  if (type === "image_classification" || type === "image_segmentation")
    return "Image"
  if (type === "video_segmentation") return "Video"
  if (false) return "Audio"
  if (type === "" || typeof type === "undefined") return "Empty"
  return "File"
}

function typeTaskDataSample(taskData) {
  if (isEmpty(taskData) || isEmpty(taskData[0])) return "Empty"
  if (!isEmpty(taskData[0].imageUrl)) return "Image"
  if (!isEmpty(taskData[0].videoUrl)) return "Video"
  return "File"
}
function checkInterfaceAndTaskData(typeAuthorize, file) {
  var result = [null, null]
  result[0] = interfaceFileType(file.content.interface.type)
  result[1] = typeTaskDataSample(file.content.taskData)
  if (typeAuthorize.includes(result[0]) && typeAuthorize.includes(result[1]))
    return true
  return false
}
function initConfigImport(file) {
  return {
    annotationToKeep: "both",
    typeOfFileToLoad: checkInterfaceAndTaskData(["Image", "Empty"], file)
      ? "Image"
      : checkInterfaceAndTaskData(["Video", "Empty"], file)
      ? "Video"
      : "None",
    typeOfFileToDisable: {
      Image: checkInterfaceAndTaskData(["Image", "Empty"], file) ? false : true,
      Video: checkInterfaceAndTaskData(["Video", "Empty"], file) ? false : true,
      Audio: true,
    },
  }
}

export default ({ file, open, onClose, onAddSamples, authConfig, user }) => {
  Amplify.configure(authConfig)
  const [s3Content, changeS3Content] = useState(null)
  const [dataForTable, changeDataForTable] = useState(null)
  const [folderToFetch, setFolderToFetch] = useState("")
  const [contentDialogBoxIsSetting, setcontentDialogBoxIsSetting] = useState(
    false
  )
  const [loadProjectIsSelected, setloadProjectIsSelected] = useState(
    true
  )
  const [configImport, setConfigImport] = useLocalStorage(
    "configImport",
    initConfigImport(file)
  )
  let _dataForTable = {}

  const lastObjectRef = useRef({})

  useEffect(() => {
    var changes = fileHasChanged(lastObjectRef.current, file)
    if (!changes.content.interface.type) return
    lastObjectRef.current = file
    setConfigImport({
      ...configImport,
      typeOfFileToLoad: checkInterfaceAndTaskData(["Image", "Empty"], file)
        ? "Image"
        : checkInterfaceAndTaskData(["Video", "Empty"], file)
        ? "Video"
        : "None",
      typeOfFileToDisable: {
        Image: checkInterfaceAndTaskData(["Image", "Empty"], file)
          ? false
          : true,
        Video: checkInterfaceAndTaskData(["Video", "Empty"], file)
          ? false
          : true,
        Audio: true,
      },
    })
  }, [file])
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
    var json
    if(loadProjectIsSelected)
      json = await GetAnnotationFromAFolderAWS(s3Content)
    else
      json = null
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
  function changeLoadProjectIsSelected(){
    setloadProjectIsSelected(!loadProjectIsSelected)
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
      <table>
        <tbody>
          <tr>
            <th>
              {loadProjectIsSelected ?(
                <Button onClick={changeLoadProjectIsSelected} disabled>Load Project</Button>
              ):(
                <Button onClick={changeLoadProjectIsSelected}>Load Project</Button>
              )
              }
              {loadProjectIsSelected ?(
                <Button onClick={changeLoadProjectIsSelected}>Load Samples</Button>
              ):(
                <Button onClick={changeLoadProjectIsSelected} disabled>Load Samples</Button>
              )
              }               
              <IconButton
                onClick={() => {
                  setcontentDialogBoxIsSetting(!contentDialogBoxIsSetting)
                }}
              >
                {contentDialogBoxIsSetting ? (
                  <StorageIcon></StorageIcon>
                ) : (
                  <SettingsIcon></SettingsIcon>
                )}
              </IconButton>
            </th>
          </tr>

          {!contentDialogBoxIsSetting ? (
            !isEmpty(dataForTable) && (
              <tr>
                <th>
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
                </th>
              </tr>
            )
          ) : (
            <tr>
              <th>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Annotation processing
                  </FormLabel>
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
          )}
        </tbody>
      </table>
    </SimpleDialog>
  )
}
