// @flow weak
import React, { useState, useEffect, useRef, useCallback } from "react"
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
import setButtonNameAddSample from "./set-button-add-sample-name"
import jsonHandler from "../../utils/file-handlers/udt-helper"
import setTypeOfFileToLoadAndDisable from "./set-type-of-file-to-load-and-disable"
import initConfigImport from "./init-config-import"
import setAnnotationFromAws from "./set-annotation-from-aws"
import useErrors from "../../utils/use-errors.js"
import ErrorToasts from "../ErrorToasts"

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
  const [errors, addError] = useErrors()

  const [configImport, setConfigImport] = useLocalStorage(
    "configImport",
    initConfigImport(file)
  )
  const lastObjectRef = useRef({})
  const CheckIfProjectIsStarted = useCallback(() => {
    if (
      isEmpty(file) ||
      isEmpty(file.content) ||
      (isEmpty(file.content.interface) && isEmpty(file.content.samples))
    )
      return false
    return true
  }, [file])

  useEffect(() => {
    if (file === lastObjectRef.current) return
    var configToSet = configImport
    var changes = jsonHandler.fileHasChanged(lastObjectRef.current, file)
    if (changes.content.interface.type || changes.content.samples) {
      if (lastObjectRef.current !== {})
        configToSet = setTypeOfFileToLoadAndDisable(configToSet, file)
    }
    configToSet.projectStarted = CheckIfProjectIsStarted()
    configToSet.loadProjectIsSelected = !CheckIfProjectIsStarted()
    setConfigImport(configToSet)
    lastObjectRef.current = file
  }, [file, configImport, setConfigImport, CheckIfProjectIsStarted])

  const handleAddSample = async () => {
    var samples = await GetImageFromAFolderAWS(
      s3Content,
      folderToFetch,
      configImport,
      authConfig
    )
    var json = null
    if (configImport.loadProjectIsSelected) {
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
      if (configImport.loadProjectIsSelected) {
        addError("Invalid project information")
      } else {
        onAddSamples(samples)
      }
    } else {
      file = setAnnotationFromAws(file, json, configImport)
      onChangeFile(file, true)
      onAddSamples([])
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
    setConfigImport({
      ...configImport,
      loadProjectIsSelected: !configImport.loadProjectIsSelected,
    })
  }

  useEffect(() => {
    var textToSet = setButtonNameAddSample(
      configImport.loadProjectIsSelected,
      configImport.typeOfFileToLoad,
      dataForTable
    )
    changetextButtonAdd(textToSet)
  }, [
    configImport.loadProjectIsSelected,
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
          disabled: configImport.contentDialogBoxIsSetting,
        },
      ]}
    >
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>
              {configImport.loadProjectIsSelected ? (
                <Button
                  style={selectedStyle}
                  onClick={changeLoadProjectIsSelected}
                  disabled
                >
                  Load Project
                </Button>
              ) : (
                <Button
                  onClick={changeLoadProjectIsSelected}
                  disabled={configImport.projectStarted}
                >
                  Load Project
                </Button>
              )}
              {configImport.loadProjectIsSelected ? (
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
                  setConfigImport({
                    ...configImport,
                    contentDialogBoxIsSetting: !configImport.contentDialogBoxIsSetting,
                  })
                }}
              >
                {configImport.contentDialogBoxIsSetting ? (
                  <StorageIcon></StorageIcon>
                ) : (
                  <SettingsIcon></SettingsIcon>
                )}
              </IconButton>
            </th>
          </tr>

          {!configImport.contentDialogBoxIsSetting ? (
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
                {configImport.loadProjectIsSelected ? (
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
                ) : (
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
                      <FormControlLabel
                        value="PDF"
                        control={<Radio />}
                        label="Load PDF file"
                        disabled={configImport.typeOfFileToDisable.PDF}
                        checked={configImport.typeOfFileToLoad === "PDF"}
                      />
                      <FormControlLabel
                        value="Texte"
                        control={<Radio />}
                        label="Load texte file"
                        disabled={configImport.typeOfFileToDisable.Texte}
                        checked={configImport.typeOfFileToLoad === "Texte"}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </th>
            </tr>
          )}
        </tbody>
      </table>
      <ErrorToasts errors={errors} />
    </SimpleDialog>
  )
}
