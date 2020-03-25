// @flow weak
import React, { useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"

import Amplify, { Storage } from 'aws-amplify'
import isEmpty from "../../utils/isEmpty"



const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300
})

const ExpandedRow = ({ data }) => {
  const { rowData, rowAnnotations, ...notImportant } = data
  const expandedDataColumns = [{ name: 'Data', selector: 'data', sortable: true }]
  const expandedAnnotationsColumns = [{ name: 'Annotations', selector: 'annotation' }]

  return (
    <>
      <DataTable
        style={{ boxSizing: "border-box", paddingLeft: '10px', paddingRight: '10px' }}
        dense
        noHeader
        columns={expandedAnnotationsColumns}
        data={rowAnnotations}
        noDataComponent='Make sure the project has "annotations" folder'
      //pagination={dataForTable.length > 10}
      //paginationPerPage={10}
      //paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
      />
      <DataTable
        style={{ boxSizing: "border-box", paddingLeft: '10px', paddingRight: '10px' }}
        dense
        noHeader
        columns={expandedDataColumns}
        data={rowData}
        noDataComponent={'Make sure the project has "data" folder'}
      //pagination={dataForTable.length > 10}
      //paginationPerPage={10}
      //paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
      />
    </>
  )
}

export default ({ open, onClose, onAddSamples, authConfig, user }) => {
  Amplify.configure(authConfig)
  const [content, changeContent] = useState("")
  const [s3Content, changeS3Content] = useState(null)
  const [dataForTable, changeDataForTable] = useState(null)

  useEffect(() => {
    if (isEmpty(user)) {
      changeS3Content(null)
    }
    else if (!isEmpty(authConfig)) {
      console.log('fetching S3')
      Storage.list('', { level: 'private' })
        .then(result => {
          changeS3Content(result)
          changeDataForTable(
            result.filter((obj) => {
              return (obj.key.endsWith('/') & obj.key.split('/').length === 2)
            }).map((obj) => {
              const folder = obj.key.split('/')[0]
              const rowDataContent = result.filter((obj) => {
                return (obj.key.startsWith(`${folder}/data/`) & !obj.key.endsWith('/'))
              }).map((obj) => {
                return (
                  { data: obj.key.split('/data/')[1] }
                )
              })
              const rowAnnotationsContent = result.filter((obj) => {
                return (obj.key.startsWith(`${folder}/annotations/`) & !obj.key.endsWith('/'))
              }).map((obj) => {
                return (
                  { annotation: obj.key.split('/annotations/')[1] }
                )
              })
              return ({
                folder: folder,
                rowData: rowDataContent,
                rowAnnotations: rowAnnotationsContent
              })
            })
          )
        })
        .catch(err => console.log(err))
    }
  }, [user])

  useEffect(() => {

  }, [dataForTable])

  const columns = [{ name: 'Projects', selector: 'folder', sortable: true }]

  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            onAddSamples(
              content
                .split("\n")
                .map(l => l.trim())
                .filter(Boolean)
                .map(s => {
                  const extension = s.split(".").slice(-1)[0]
                  switch (extension.toLowerCase()) {
                    case "png":
                    case "jpg":
                    case "gif":
                    case "jpeg":
                    case "bmp": {
                      return { imageUrl: s }
                    }
                    case "pdf": {
                      return { pdfUrl: s }
                    }
                    default: {
                      // TODO throw error or toast
                      console.error("extension not recognized")
                      return null
                    }
                  }
                })
            )
          }
        }
      ]}
    >
      {!isEmpty(dataForTable) && (
        <DataTable
          expandableRowsComponent={<ExpandedRow />}
          expandableRows
          dense
          noHeader
          columns={columns}
          data={dataForTable}
          pagination={dataForTable.length > 10}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        />
      )}
    </SimpleDialog>
  )
}
