import React, { useEffect, useState } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import Radio from "@material-ui/core/Radio"
import isEmpty from "lodash/isEmpty"
import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import useAuth from "../../utils/auth-handlers/use-auth"

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

export default ({ open, onClose, onAddSamples }) => {
  const [dm, setDm] = useState(null)
  const { authConfig } = useAuth()
  const [projects, setProjects] = useState()
  const [projectToFetch, setProjectToFetch] = useState()

  const handleRowSelected = (whatsChanging) => {
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
          rowAnnotationsUrl: rowAnnotationsContent,
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
    if (!dm) setDm(new datasetManagerCognito({ authConfig }))
  }, [open, authConfig, dm])

  useEffect(() => {
    if (!open) return
    getProjects()
    // eslint-disable-next-line
  }, [dm, open])

  useEffect(() => {
    if (!open) return
    setProject()
    // eslint-disable-next-line
  }, [projectToFetch, open])

  const handleAddSample = async () => {
    if (!projectToFetch) return
    var jsons = await dm.readJSONAllSample(projectToFetch.rowAnnotationsUrl)
    onAddSamples(jsons)
  }

  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Take sample from project",
          onClick: () => {
            handleAddSample()
          },
        },
      ]}
    >
      {!isEmpty(projects) && (
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
      )}
    </SimpleDialog>
  )
}
