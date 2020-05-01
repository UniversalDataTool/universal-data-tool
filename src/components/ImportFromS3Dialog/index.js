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
import { useLocalStorage } from "react-use"
import fileHasChanged from "../../utils/fileHasChanged"
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
import Button from "@material-ui/core/Button"
import GetAnnotationFromAFolderAWS from "./get-annotation-from-aws"
import GetImageFromAFolderAWS from "./get-images-from-aws"
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"

const selectedStyle = { color: "DodgerBlue" }
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
      "font-weight": "bold",
    },
  },
  cells: {
    style: {
      paddingLeft: "25px",
    },
  },
}

const ExpandedRow = ({ data }) => {
  const { rowData, rowAnnotations } = data
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
  if (isEmpty(type)) return "Empty"
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
  const [textButtonAdd, changetextButtonAdd] = useState("Add Samples")
  const [s3Content, changeS3Content] = useState(null)
  const [dataForTable, changeDataForTable] = useState(null)
  const [folderToFetch, setFolderToFetch] = useState("")
  const [contentDialogBoxIsSetting, setcontentDialogBoxIsSetting] = useState(
    false
  )
  const [loadProjectIsSelected, setloadProjectIsSelected] = useState(true)
  const [configImport, setConfigImport] = useLocalStorage(
    "configImport",
    initConfigImport(file)
  )

  useEffect(() => {
    setConfigImport({
      ...configImport,
      typeOfFileToLoad: 
        !isEmpty(configImport)&&
        !isEmpty(configImport.typeOfFileToLoad)&&
        checkInterfaceAndTaskData([configImport.typeOfFileToLoad,"Empty"], file)
        ? configImport.typeOfFileToLoad:
        checkInterfaceAndTaskData(["Image","Empty"], file)
        ? "Image"
        : checkInterfaceAndTaskData(["Video","Empty"], file)
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
  }, [file, configImport, setConfigImport])

  const handleAddSample = async () => {
    var samples = await GetImageFromAFolderAWS(
      s3Content,
      folderToFetch,
      configImport,
      authConfig
    )
    var json
    if (loadProjectIsSelected) {
      json = await GetAnnotationFromAFolderAWS(
        s3Content,
        samples,
        folderToFetch,
        authConfig
      )
    } else json = null
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
  function changeLoadProjectIsSelected() {
    setloadProjectIsSelected(!loadProjectIsSelected)
  }

  useEffect(() => {
    var numberOfSamples = 0
    if (folderToFetch !== "" && !isEmpty(dataForTable)) {
      for (var i = 0; i < dataForTable.length; i++) {
        if (dataForTable[i].folder === folderToFetch) {
          if (!isEmpty(dataForTable[i].rowData)) {
            for (var y = 0; y < dataForTable[i].rowData.length; y++) {
              if (
                RecognizeFileExtension(dataForTable[i].rowData[y].data) ===
                configImport.typeOfFileToLoad
              ) {
                numberOfSamples++
              }
            }
          }
        }
      }
      if (loadProjectIsSelected) {
        changetextButtonAdd("Load " + folderToFetch)
      } else {
        changetextButtonAdd(
          "Add " + numberOfSamples + " " + configImport.typeOfFileToLoad
        )
      }
    }
  }, [
    folderToFetch,
    loadProjectIsSelected,
    configImport.typeOfFileToLoad,
    dataForTable,
  ])

  useEffect(() => {
    if (isEmpty(user)) {
      changeS3Content(null)
    } else if (!isEmpty(authConfig)) {
      Storage.list("", { level: "private" })
        .then((result) => {
          changeS3Content(result)
          let _dataForTable = result
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
  }, [user, authConfig])
  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: textButtonAdd,
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
              {loadProjectIsSelected ? (
                <Button
                  style={selectedStyle}
                  onClick={changeLoadProjectIsSelected}
                  disabled
                >
                  Load Project
                </Button>
              ) : (
                <Button onClick={changeLoadProjectIsSelected}>
                  Load Project
                </Button>
              )}
              {loadProjectIsSelected ? (
                <Button onClick={changeLoadProjectIsSelected}>
                  Load Samples
                </Button>
              ) : (
                <Button
                  style={selectedStyle}
                  onClick={changeLoadProjectIsSelected}
                  disabled
                >
                  Load Samples
                </Button>
              )}
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
                      checked={configImport.annotationToKeep === "both"}
                    />
                    <FormControlLabel
                      value="incoming"
                      control={<Radio />}
                      label="Keep incoming annotations"
                      checked={configImport.annotationToKeep === "incoming"}
                    />
                    <FormControlLabel
                      value="current"
                      control={<Radio />}
                      label="Keep current annotations"
                      checked={configImport.annotationToKeep === "current"}
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Choose file type</FormLabel>
                  <RadioGroup
                    aria-label="option2"
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
                      checked={configImport.typeOfFileToLoad === "Image"}
                    />
                    <FormControlLabel
                      value="Video"
                      control={<Radio />}
                      label="Load video file"
                      disabled={configImport.typeOfFileToDisable.Video}
                      checked={configImport.typeOfFileToLoad === "Video"}
                    />
                    <FormControlLabel
                      value="Audio"
                      control={<Radio />}
                      label="Load audio file"
                      disabled={configImport.typeOfFileToDisable.Audio}
                      checked={configImport.typeOfFileToLoad === "Audio"}
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
