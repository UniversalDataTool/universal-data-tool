import React from "react"
import DataTable from "react-data-table-component"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const { rowAssets, rowAnnotations } = data
  const expandedAssetsColumns = [
    { name: t("assets"), selector: "assets", sortable: true },
    { name: t("last-modified"), selector: "lastModified", sortable: true },
  ]

  const expandedAnnotationsColumns = [
    { name: t("annotations"), selector: "annotation" },
    { name: t("last-modified"), selector: "lastModified", sortable: true },
  ]
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
          noDataComponent={t("has-samples-folder")}
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
          noDataComponent={t("has-data-folder")}
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
