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
import SettingImport from "./interface-setting-import"
import HeaderTableImport from "./header-table-import"
import { Radio } from "@material-ui/core/"
<<<<<<< HEAD
import importConfigIsReady from "./config-import-is-ready"
import WarningHeader from "./warning-header"
=======
import getSources from "./get-sources"
>>>>>>> 916e9ca (Export Cognito Stable with Import Cognito)
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
  const [configImport, setConfigImport] = useState({})
  console.log(configImport)
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
    var configToSet = configImport

    var hasChanged = false
    if (oldData === lastObjectRef.current) {
      const changes = datasetHasChanged(lastObjectRef.current, oldData)
      if (changes.interface.type || changes.samples) {
        configToSet = setTypeOfFileToLoadAndDisable(configToSet, oldData)
        hasChanged = true
      }
    }
    if (
      importConfigIsReady(projectToFetch, configImport) !== configImport.isReady
    ) {
      configToSet = {
        ...configToSet,
        isReady: importConfigIsReady(projectToFetch, configImport),
      }
      hasChanged = true
    }
    if (hasChanged) {
      setConfigImport({
        ...configToSet,
        projectStarted: hasProjectStarted(),
      })
      lastObjectRef.current = oldData
    }
  }, [
    oldData,
    configImport,
    setConfigImport,
    hasProjectStarted,
    projectToFetch,
  ])

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
      setProjectToFetch("")
    }
  }

  const getProjects = async () => {
    if (!open) return
    if (!dm) return
    if (!(await dm.isReady())) return
    var dataFolder = Array.from(await dm.getProjects())

    var data = await Promise.all(
      dataFolder.map(async (obj, index) => {
        const folder = obj
        var isSelected = false
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
    if (!projectToFetch) return
    dm.setProject(projectToFetch.folder)
  }
  useEffect(() => {
    if (!open) return
    if (!authConfig) return
    if (!dm) {
      setDm(new datasetManagerCognito({ authConfig }))
      setConfigImport(initConfigImport(oldData))
    }
  }, [open, authConfig, dm, oldData])

  useEffect(() => {
    if (!open) return
    getProjects()
    // eslint-disable-next-line
  }, [dm, open])

  useEffect(() => {
    if (!open) return
    setProject()
    // eslint-disable-next-line
  }, [projectToFetch])
  const createJsonFromAsset = async () => {
    var jsons = await Promise.all(
      projectToFetch.rowAssetsUrl.map(async (obj) => {
        return await createJsonFromUrlAWS(
          dm.projectName,
          obj.split("/assets/")[1]
        )
      })
    )
    onAddSamples(jsons)
  }

  const createJsonFromUrlAWS = async (projectName, imageName) => {
    var url = await dm.getAssetUrl(imageName, projectName)
    var json = setUrl(url, configImport)
    if (json) json = setIn(json, ["_id"], imageName)
    if (json) json = setIn(json, ["source"], projectName)
    return json
  }

  const createJsonFromAnnotation = async () => {
    var jsons = await dm.readJSONAllSamples(projectToFetch.rowAnnotationsUrl)
    var sources = getSources(jsons)
    if (sources) {
      jsons = await Promise.all(
        jsons.map(async (json) => {
          if (json.source)
            json = await createJsonFromUrlAWS(json.source, json._id)
          return json
        })
      )
    }
    onAddSamples(jsons)
  }

  const handleAddSample = async () => {
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
          disabled: !configImport.isReady,
        },
      ]}
    >
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th>
              <WarningHeader
                configImport={configImport}
                projectToFetch={projectToFetch}
              />
            </th>
          </tr>
          <tr>
            <th>
              <HeaderTableImport
                configImport={configImport}
                setConfigImport={setConfigImport}
              />
            </th>
          </tr>
          {!configImport.contentDialogBoxIsSetting ? (
            !isEmpty(projects) && (
              <tr>
                <th>
                  <DataTable
                    expandableRows
                    expandableRowsComponent={
                      <ExpandedRow
                        projects={projects}
                        loadAssetIsSelected={configImport.loadAssetsIsSelected}
                      />
                    }
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
            <SettingImport
              configImport={configImport}
              setConfigImport={setConfigImport}
            />
          )}
        </tbody>
      </table>
    </SimpleDialog>
  )
}
