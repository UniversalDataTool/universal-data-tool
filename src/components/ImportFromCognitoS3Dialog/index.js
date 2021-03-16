import React, { useEffect, useRef, useState, useCallback } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import useDataset from "../../hooks/use-dataset"
import isEmpty from "lodash/isEmpty"
import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import useAuth from "../../utils/auth-handlers/use-auth"
import setTypeOfFileToLoadAndDisable from "./set-type-of-file-to-load-and-disable"
import initConfigImport from "./init-config-import"
import setUrl from "./set-url"
import { setIn } from "seamless-immutable"
import ExpandedRow from "./table-expanded-row"
import SettingImport from "./interface-setting-import"
import HeaderTableImport from "./header-table-import"
import { Radio, Grid } from "@material-ui/core/"
import importConfigIsReady from "./config-import-is-ready"
import WarningHeader from "./warning-header"
import getSources from "./get-sources"
import { useTranslation } from "react-i18next"

export default ({ open, onClose, onAddSamples }) => {
  const [dm, setDm] = useState(null)
  const [oldData] = useDataset()
  const { authConfig } = useAuth()
  const [projects, setProjects] = useState()
  const [projectToFetch, setProjectToFetch] = useState("")
  const [configImport, setConfigImport] = useState({})
  const lastObjectRef = useRef({})
  const { t } = useTranslation()
  const columns = [{ name: t("projects"), selector: "folder", sortable: true }]

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
    if (!open) return
    var configToSet = configImport
    var hasChanged = false
    if (JSON.stringify(oldData) !== JSON.stringify(lastObjectRef.current)) {
      configToSet = setTypeOfFileToLoadAndDisable(configToSet, oldData)
      hasChanged = true
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
    open,
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

  useEffect(() => {
    if (!open) return
    if (!authConfig) return
    if (!dm) setDm(new datasetManagerCognito({ authConfig }))
  }, [open, authConfig, dm])

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
        if (projectToFetch && projectToFetch.folder === folder)
          isSelected = true
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
          isSelected: isSelected,
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
      title={t("select-project")}
      open={open}
      onClose={onClose}
      actions={[
        {
          text: t("take-samples-from-project"),
          onClick: () => {
            handleAddSample()
          },
          disabled: !configImport.isReady,
        },
      ]}
    >
      <Grid container spacing={0}>
        <Grid container item xs={12} spacing={0} justify="center">
          <WarningHeader
            configImport={configImport}
            projectToFetch={projectToFetch}
          />
        </Grid>
        <Grid container item xs={12} spacing={0} justify="center">
          <HeaderTableImport
            configImport={configImport}
            setConfigImport={setConfigImport}
          />
        </Grid>
        {!configImport.contentDialogBoxIsSetting ? (
          !isEmpty(projects) && (
            <Grid container item xs={12} spacing={0} justify="center">
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
            </Grid>
          )
        ) : (
          <SettingImport
            configImport={configImport}
            setConfigImport={setConfigImport}
          />
        )}
      </Grid>
    </SimpleDialog>
  )
}
