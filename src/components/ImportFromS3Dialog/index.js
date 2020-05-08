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
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
import Button from "@material-ui/core/Button"
import GetAnnotationFromAFolderAWS from "./get-annotation-from-aws"
import GetImageFromAFolderAWS from "./get-images-from-aws"
import fileHasChanged from "../../utils/fileHasChanged"
import setButtonNameAddSample from "./set-button-add-sample-name"
import jsonHandler from "../../utils/file-handlers/recent-items-handler"
import { setIn } from "seamless-immutable"

const selectedStyle = { color: "DodgerBlue" }
const tableStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
}
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
  if (type === "audio_transcription") return "Audio"
  if (isEmpty(type)) return "Empty"
  return "File"
}

function typesamplesSample(samples) {
  if (isEmpty(samples) || isEmpty(samples[0])) return "Empty"
  if (!isEmpty(samples[0].imageUrl)) return "Image"
  if (!isEmpty(samples[0].videoUrl)) return "Video"
  if (!isEmpty(samples[0].audioUrl)) return "Audio"
  return "File"
}
function checkInterfaceAndsamples(typeAuthorize, file) {
  var result = [null, null]
  result[0] = interfaceFileType(file.content.interface.type)
  result[1] = typesamplesSample(file.content.samples)
  if (typeAuthorize.includes(result[0]) && typeAuthorize.includes(result[1]))
    return true
  return false
}
function initConfigImport(file) {
  return {
    annotationToKeep: "both",
    typeOfFileToLoad: checkInterfaceAndsamples(["Image", "Empty"], file)
      ? "Image"
      : checkInterfaceAndsamples(["Video", "Empty"], file)
      ? "Video"
      : checkInterfaceAndsamples(["Audio", "Empty"], file)
      ? "Audio"
      : "None",
    typeOfFileToDisable: {
      Image: checkInterfaceAndsamples(["Image", "Empty"], file) ? false : true,
      Video: checkInterfaceAndsamples(["Video", "Empty"], file) ? false : true,
      Audio: checkInterfaceAndsamples(["Audio", "Empty"], file) ? false : true,
    },
  }
}

export default ({
  file,
  open,
  onClose,
  onAddSamples,
  onChangeFile,
  authConfig,
  user,
}) => {
  try {
    Amplify.configure(authConfig)
  } catch (e) {}
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
  const lastObjectRef = useRef({})
  useEffect(() => {
    var changes = fileHasChanged(lastObjectRef.current, file)
    if (!changes.content.interface.type) return
    if (lastObjectRef.current === {}) {
      lastObjectRef.current = file
    } else {
      lastObjectRef.current = file
      setConfigImport({
        ...configImport,
        typeOfFileToLoad:
          !isEmpty(configImport) &&
          !isEmpty(configImport.typeOfFileToLoad) &&
          checkInterfaceAndsamples(
            [configImport.typeOfFileToLoad, "Empty"],
            file
          )
            ? configImport.typeOfFileToLoad
            : checkInterfaceAndsamples(["Image", "Empty"], file)
            ? "Image"
            : checkInterfaceAndsamples(["Video", "Empty"], file)
            ? "Video"
            : checkInterfaceAndsamples(["Audio", "Empty"], file)
            ? "Audio"
            : "None",
        typeOfFileToDisable: {
          Image: checkInterfaceAndsamples(["Image", "Empty"], file)
            ? false
            : true,
          Video: checkInterfaceAndsamples(["Video", "Empty"], file)
            ? false
            : true,
          Audio: checkInterfaceAndsamples(["Audio", "Empty"], file)
            ? false
            : true,
        },
      })
    }
  }, [file, configImport, setConfigImport])

  const handleAddSample = async () => {
    var samples = await GetImageFromAFolderAWS(
      s3Content,
      folderToFetch,
      configImport,
      authConfig
    )
    var json = null
    if (loadProjectIsSelected) {
      json = await GetAnnotationFromAFolderAWS(
        s3Content,
        samples,
        folderToFetch,
        authConfig
      )
    }

    if (
      isEmpty(json) ||
      isEmpty(json.content) ||
      isEmpty(json.content.samples) ||
      isEmpty(json.fileName)
    ) {
      onAddSamples(samples)
    } else {
      var contentOldFile = jsonHandler.concatSample(file.content,json.content,configImport.annotationToKeep)
      
      contentOldFile = setIn(contentOldFile, ["interface"], json.content.interface)
      file = setIn(file, ["content"], contentOldFile)
      if (isEmpty(file.fileName) || file.fileName === "unnamed")
        file = setIn(file, ["fileName"], json.fileName)
      onChangeFile(file, true)
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
    var textToSet = setButtonNameAddSample(
      loadProjectIsSelected,
      configImport.typeOfFileToLoad,
      dataForTable
    )
    changetextButtonAdd(textToSet)
  }, [loadProjectIsSelected, configImport.typeOfFileToLoad, dataForTable])

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
      <table style={tableStyle}>
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
