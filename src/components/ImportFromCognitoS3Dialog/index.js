import React, { useEffect, useRef, useState, useCallback } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import useDataset from "../../hooks/use-dataset"
import isEmpty from "lodash/isEmpty"
import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import useAuth from "../../utils/auth-handlers/use-auth"
import setTypeOfFileToLoadAndDisable from "./set-type-of-file-to-load-and-disable"
import initConfigImport from "./init-config-import"
import datasetHasChanged from "../../utils//dataset-helper/get-files-differences"
import setUrl from "./set-url"
import { setIn } from "seamless-immutable"
import ExpandedRow from "./table-expanded-row"
import {
  Settings as SettingsIcon,
  Storage as StorageIcon,
} from "@material-ui/icons/"
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  FormLabel,
  IconButton,
} from "@material-ui/core/"
const selectedStyle = { color: "DodgerBlue" }
const tableStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
}

const columns = [{ name: "Projects", selector: "folder", sortable: true }]

export default ({ open, onClose, onAddSamples }) => {
  const [dm, setDm] = useState(null)
  const [oldData] = useDataset()
  const { authConfig } = useAuth()
  const [projects, setProjects] = useState(null)
  const [projectToFetch, setProjectToFetch] = useState("")
  const [configImport, setConfigImport] = useState(initConfigImport(oldData))
  const lastObjectRef = useRef({})

  const hasProjectStarted = useCallback(() => {
    if (!open) return
    if (
      isEmpty(oldData) ||
      (isEmpty(oldData.interface) && isEmpty(oldData.samples))
    )
      return false
    return true
  }, [oldData, open])

  useEffect(() => {
    if (oldData === lastObjectRef.current) return
    var configToSet = configImport
    const changes = datasetHasChanged(lastObjectRef.current, oldData)
    if (changes.interface.type || changes.samples) {
      configToSet = setTypeOfFileToLoadAndDisable(configToSet, oldData)
    }
    setConfigImport({
      ...configToSet,
      projectStarted: hasProjectStarted(),
    })
    console.log("changes")
    console.log(configImport)
    lastObjectRef.current = oldData
  }, [oldData, configImport, setConfigImport, hasProjectStarted])

  const handleRowSelected = (whatsChanging) => {
    if (!open) return
    if (!isEmpty(whatsChanging.selectedRows[0])) {
      setProjectToFetch(whatsChanging.selectedRows[0])
      setProjects((prevState) =>
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
      setProjectToFetch(null)
    }
  }

  const loadAssetsOrAnnotations = () => {
    setConfigImport({
      ...configImport,
      loadAssetsIsSelected: !configImport.loadAssetsIsSelected,
    })
  }

  const getProjects = async () => {
    if (!open) return
    if (!dm) return
    if (!(await dm.isReady())) return
    var dataFolder = Array.from(await dm.getProjects())

    var data = await Promise.all(
      dataFolder.map(async (obj, index) => {
        const folder = obj
        const rowAnnotationsContent = await dm.getListSamples({
          projectName: obj,
        })
        const rowAssetsContent = await dm.getListAssets({
          projectName: obj,
        })
        return {
          id: `${index}`,
          folder: folder,
          rowAnnotations: rowAnnotationsContent.map((obj) => {
            return {
              annotation: obj.split("/samples/")[1],
            }
          }),
          rowAssets: rowAssetsContent.map((obj) => {
            return {
              assets: obj.split("/assets/")[1],
            }
          }),
          rowAnnotationsUrl: rowAnnotationsContent,
          rowAssetsUrl: rowAssetsContent,
          isSelected: false,
        }
      })
    )
    setProjects(data)
  }
  const setProject = async () => {
    if (!open) return
    if (!dm) return
    if (!(await dm.isReady())) return
    dm.setProject(projectToFetch.folder)
  }
  useEffect(() => {
    if (!open) return
    if (!authConfig) return
    if (!dm) setDm(new datasetManagerCognito({ authConfig }))
  }, [open, authConfig, dm])

  useEffect(() => {
    getProjects()
    // eslint-disable-next-line
  }, [dm])

  useEffect(() => {
    setProject()
    // eslint-disable-next-line
  }, [projectToFetch])
  const createJsonFromAsset = async () => {
    var jsons = await Promise.all(
      projectToFetch.rowAssetsUrl.map(async (obj) => {
        var url = await dm.getDataUrl(obj.split("/assets/")[1])
        var json = setUrl(url, configImport)
        if (json) json = setIn(json, ["_id"], obj.split("/assets/")[1])
        return json
      })
    )
    onAddSamples(jsons)
  }

  const createJsonFromAnnotation = async () => {
    var jsons = await dm.readJSONAllSample(projectToFetch.rowAnnotationsUrl)
    onAddSamples(jsons)
  }

  const handleAddSample = async () => {
    if (!projectToFetch) return
    if (configImport.loadAssetsIsSelected) {
      createJsonFromAsset()
    } else {
      createJsonFromAnnotation()
    }
  }

  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Take samples from project",
          onClick: () => {
            handleAddSample()
          },
          disabled: configImport.contentDialogBoxIsSetting,
        },
      ]}
    >
      {console.log("render")}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>
              {configImport.loadAssetsIsSelected ? (
                <Button
                  style={selectedStyle}
                  onClick={loadAssetsOrAnnotations}
                  disabled
                >
                  Load Assets
                </Button>
              ) : (
                <Button onClick={loadAssetsOrAnnotations}>Load Assets</Button>
              )}
              {configImport.loadAssetsIsSelected ? (
                <Button onClick={loadAssetsOrAnnotations}>
                  Load Annotations
                </Button>
              ) : (
                <Button
                  style={selectedStyle}
                  onClick={loadAssetsOrAnnotations}
                  disabled
                >
                  Load Annotations
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
            !isEmpty(projects) && (
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
                    data={projects}
                    pagination={projects.length > 10}
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
                  />
                </th>
              </tr>
            )
          ) : (
            <tr>
              <th>
                {!configImport.loadAssetsIsSelected ? (
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
    </SimpleDialog>
  )
}
