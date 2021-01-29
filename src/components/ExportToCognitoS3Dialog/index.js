import React, { useEffect, useState } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import isEmpty from "lodash/isEmpty"
import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import useAuth from "../../utils/auth-handlers/use-auth"
import { Grid, TextField } from "@material-ui/core"
import { useTranslation } from "react-i18next"
const orangeText = { color: "orange" }

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

export default ({ open, onClose }) => {
  const [dm, setDm] = useState()
  const { authConfig } = useAuth()
  const [projects, setProjects] = useState()
  const [activeDatasetManager] = useActiveDatasetManager()
  const [nameProjectToCreate, setNameProjectToCreate] = useState("")
  const [nameProjectExist, setNameProjectExist] = useState(false)
  const [currentDataset, setCurrentDataset] = useState()
  const { t } = useTranslation()
  const columns = [{ name: t("projects"), selector: "folder", sortable: true }]
  const expandedAnnotationsColumns = [
    { name: t("annotations"), selector: "annotation" },
    { name: t("last-modified"), selector: "lastModified", sortable: true },
  ]
  const ExpandedRow = ({ data }) => {
    const { rowAnnotations } = data
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
          noDataComponent={t("has-samples-folder")}
          pagination={rowAnnotations.length > 10}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
          customStyles={customStyles}
        />
      </>
    )
  }
  const [refreshInterface, setRefreshInterface] = useState(false)

  const getCurrentDataset = async () => {
    if (currentDataset) return currentDataset
    setCurrentDataset(await activeDatasetManager.getDataset())
    setRefreshInterface(true)
    return currentDataset
  }

  const getProjectName = () => {
    if (!currentDataset) return
    if (!currentDataset.name) return
    setNameProjectToCreate(currentDataset.name)
    return currentDataset.name
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
        return {
          id: `${index}`,
          folder: folder,
          rowAnnotations: rowAnnotationsContent.map((obj) => {
            return {
              annotation: obj.split("/samples/")[1],
            }
          }),
          rowAnnotationsUrl: rowAnnotationsContent,
          isSelected: false,
        }
      })
    )
    setProjects(data)
  }
  useEffect(() => {
    if (!open) return
    if (!authConfig) return
    if (!dm) setDm(new datasetManagerCognito({ authConfig }))
    // eslint-disable-next-line
  }, [dm, open, authConfig])

  useEffect(() => {
    if (!open) return
    getCurrentDataset()
    getProjectName()
    // eslint-disable-next-line
  }, [open, refreshInterface])

  useEffect(() => {
    if (!open) return
    getProjects()
    // eslint-disable-next-line
  }, [open, dm])

  useEffect(() => {
    if (!projects) return
    var exist = false
    for (var i = 0; i < projects.length; i++)
      if (projects[i].folder === nameProjectToCreate) exist = true
    setNameProjectExist(exist)
  }, [nameProjectToCreate, projects])

  const handleCreateProject = async () => {
    if (!currentDataset) return
    var dataset = currentDataset
    dataset = dataset.setIn(["name"], nameProjectToCreate)
    if (nameProjectExist) await dm.removeSamplesFolder(nameProjectToCreate)
    await dm.setDataset(dataset)
    await activeDatasetManager.setDataset(dataset)
    await getProjects()
    onClose()
  }

  return (
    <SimpleDialog
      title={t("export-project")}
      open={open}
      onClose={onClose}
      actions={[
        {
          text: t("create-project"),
          onClick: () => {
            handleCreateProject()
          },
        },
      ]}
    >
      {
        <Grid container spacing={0}>
          <Grid container item xs={12} spacing={0} justify="center">
            {nameProjectExist ? (
              <p style={orangeText}>{t("warning-project-exist")}</p>
            ) : (
              <p></p>
            )}
          </Grid>
          <Grid container item xs={12} spacing={0} justify="center">
            <TextField
              id="ProjectName"
              label={t("project-name")}
              variant="outlined"
              onChange={(event) => {
                setNameProjectToCreate(event.target.value)
              }}
              value={nameProjectToCreate}
            />
          </Grid>
          <Grid container item xs={12} spacing={0} justify="center">
            {!isEmpty(projects) && (
              <DataTable
                expandableRows
                expandableRowsComponent={<ExpandedRow />}
                dense
                noHeader
                noTableHead
                columns={columns}
                selectableRowSelected={(row) => row.isSelected}
                data={projects}
                pagination={projects.length > 10}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
              />
            )}
          </Grid>
        </Grid>
      }
    </SimpleDialog>
  )
}
