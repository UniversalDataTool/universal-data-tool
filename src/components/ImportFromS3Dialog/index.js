// @flow weak
import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"

import Amplify, { Storage } from 'aws-amplify';
import isEmpty from "../../utils/isEmpty";



const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300
})

export default ({ open, onClose, onAddSamples, authConfig }) => {
  Amplify.configure(authConfig)
  const [content, changeContent] = useState("")
  const [s3Content, changeS3Content] = useState(null)
  const [currentDirectory, changeCurrentDirectory] = useState("/")
  const [dataForTable, changeDataForTable] = useState(null)


  if (s3Content === null) {
    Storage.list('', { level: 'private' })
      .then(result => {
        changeS3Content(result)
        changeDataForTable(
          result.filter((obj) => {
            return obj.key.endsWith('/');
          }).map((obj) => {
            return ({ folder: obj.key.split('/')[0] })
          })
        )
      })
      .catch(err => console.log(err))


  }

  const columns = [{ name: 'Folder', selector: 'folder', sortable: true }]

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
          //expandableRowsComponent={<ExpandedRow />}
          //expandableRows
          dense
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
