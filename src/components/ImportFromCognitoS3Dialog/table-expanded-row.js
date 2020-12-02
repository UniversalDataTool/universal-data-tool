import React from "react"
import DataTable from "react-data-table-component"

const expandedAssetsColumns = [
  { name: "Assets", selector: "assets", sortable: true },
  { name: "Last Modified", selector: "lastModified", sortable: true },
]

const expandedAnnotationsColumns = [
  { name: "Annotations", selector: "annotation" },
  { name: "Last Modified", selector: "lastModified", sortable: true },
]

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

const ExpandedRow = ({ data, loadAssetIsSelected }) => {
  const { rowAssets, rowAnnotations } = data
  return (
    <>
      {!loadAssetIsSelected ? (
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
      ) : (
        <DataTable
          style={{
            boxSizing: "border-box",
            paddingLeft: "50px",
            paddingRight: "10px",
          }}
          dense
          striped
          noHeader
          columns={expandedAssetsColumns}
          data={rowAssets}
          noDataComponent={'Make sure the project has "data" folder'}
          pagination={rowAssets.length > 10}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
          customStyles={customStyles}
        />
      )}
    </>
  )
}
export default ExpandedRow
