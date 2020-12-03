import React, { useEffect, useState } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import isEmpty from "lodash/isEmpty"
import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import useAuth from "../../utils/auth-handlers/use-auth"
<<<<<<< HEAD
import { TextField, Grid } from "@material-ui/core"

const redText = { color: "orange" }
=======
import { TextField } from "@material-ui/core"
const orangeText = { color: "orange" }
const tableStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%",
}
>>>>>>> 9d9d732 (ExportCognitoFeature)

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
        noDataComponent='Make sure the project has "samples" folder'
        pagination={rowAnnotations.length > 10}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        customStyles={customStyles}
      />
    </>
  )
}

export default ({ open, onClose }) => {
  const [dm, setDm] = useState()
  const { authConfig } = useAuth()
  const [projects, setProjects] = useState()
  const [activeDatasetManager] = useActiveDatasetManager()
  const [nameProjectToCreate, setNameProjectToCreate] = useState("")
  const [nameProjectExist, setNameProjectExist] = useState(false)
<<<<<<< HEAD
  const [currentDataset, setCurrentDataset] = useState()

  const getCurrentDataset = async () => {
    if (currentDataset) return currentDataset
    setCurrentDataset(await activeDatasetManager.getDataset())
    return currentDataset
  }

  const getProjectName = () => {
    if (!currentDataset) return
    if (!currentDataset.name) return
    setNameProjectToCreate(currentDataset.name)
    return currentDataset.name
  }

=======
  const getCurrentDataset = async () => {
    var ds = await activeDatasetManager.getDataset()
    if (!ds) return
    if (!ds.name) return
    setNameProjectToCreate(ds.name)
    return ds
  }
>>>>>>> 9d9d732 (ExportCognitoFeature)
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
<<<<<<< HEAD
=======
    getCurrentDataset()
>>>>>>> 9d9d732 (ExportCognitoFeature)
    // eslint-disable-next-line
  }, [dm, open, authConfig])

  useEffect(() => {
<<<<<<< HEAD
    if (!open) return
    getCurrentDataset()
    getProjectName()
    // eslint-disable-next-line
  }, [open, activeDatasetManager])

  useEffect(() => {
    if (!open) return
    getProjects()
    // eslint-disable-next-line
  }, [open, dm])
=======
    getCurrentDataset()
    // eslint-disable-next-line
  }, [activeDatasetManager])

  useEffect(() => {
    getProjects()
    // eslint-disable-next-line
  }, [dm])
>>>>>>> 9d9d732 (ExportCognitoFeature)

  useEffect(() => {
    if (!projects) return
    var exist = false
    for (var i = 0; i < projects.length; i++)
      if (projects[i].folder === nameProjectToCreate) exist = true
    setNameProjectExist(exist)
  }, [nameProjectToCreate, projects])

  const handleCreateProject = async () => {
    if (nameProjectExist) await dm.removeProject(nameProjectToCreate)
<<<<<<< HEAD
    var dataset = currentDataset
=======
    var dataset = await activeDatasetManager.getDataset()
>>>>>>> 9d9d732 (ExportCognitoFeature)
    dataset = dataset.setIn(["name"], nameProjectToCreate)
    await dm.createProject({
      name: nameProjectToCreate,
      interface: dataset.interface,
    })
    await dm.setDataset(dataset)
<<<<<<< HEAD
    await activeDatasetManager.setDatasetProperty("name", nameProjectToCreate)
=======
    await activeDatasetManager.setDataset(dataset)
>>>>>>> 9d9d732 (ExportCognitoFeature)
    await getProjects()
    onClose()
  }

  return (
    <SimpleDialog
      title="Export Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Create project",
          onClick: () => {
            handleCreateProject()
          },
        },
      ]}
    >
      {
<<<<<<< HEAD
        <Grid container spacing={0}>
          <Grid container item xs={12} spacing={0} justify="center">
            {nameProjectExist ? (
              <p style={redText}>
                Warning : This project name already exist. If you continue the
                existing project with the same name will be replaced
              </p>
            ) : (
              <p></p>
            )}
          </Grid>
          <Grid container item xs={12} spacing={0} justify="center">
            <TextField
              id="ProjectName"
              label="Project Name"
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
=======
        <table style={tableStyle}>
          <tbody>
            {nameProjectExist ? (
              <tr>
                <th>
                  <p style={orangeText}>
                    Warning : This project name already exist. If you continue
                    the existing project with the same name will be replaced
                  </p>
                </th>
              </tr>
            ) : (
              <tr>
                <th>
                  <p></p>
                </th>
              </tr>
            )}
            <tr>
              <th>
                <TextField
                  id="ProjectName"
                  label="Project Name"
                  variant="outlined"
                  onChange={(event) => {
                    setNameProjectToCreate(event.target.value)
                  }}
                  value={nameProjectToCreate}
                />
              </th>
            </tr>
            {!isEmpty(projects) && (
              <tr>
                <th>
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
                </th>
              </tr>
            )}
          </tbody>
        </table>
>>>>>>> 9d9d732 (ExportCognitoFeature)
      }
    </SimpleDialog>
  )
}
