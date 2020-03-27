// @flow weak
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import Radio from '@material-ui/core/Radio';

import Amplify, { Storage } from 'aws-amplify'
import isEmpty from "../../utils/isEmpty"

/*
Storage.get(`${folder}/data/${obj.key.split('/data/')[1]}`, { expires: 24 * 60 * 60, level: 'private' })
                .then(result => {
                  addImageUrl(result, folder, obj.key.split('/data/')[1])
                  return result
                })
                .catch(err => {
                  console.log('error getting link for s3 image', err)
                  return null
                })
*/

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300
})

const expandedDataColumns = [{ name: 'Data', selector: 'data', sortable: true }]

const expandedAnnotationsColumns = [{ name: 'Annotations', selector: 'annotation' }]

const columns = [{ name: 'Projects', selector: 'folder', sortable: true }]


const ExpandedRow = ({ data }) => {
  const { rowData, rowAnnotations, ...notImportant } = data

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
  const [showImage, changeShowImage] = useState(false)
  const [resolvedUrls, changeResolvedUrls] = useState({})
  const [toggleCleared, setToggleCleared] = useState(false);
  const [displayTable, setDisplayTable] = useState(false)

  let _dataForTable = {}

  const addImageUrl = (result, folder, imgName) => {
    changeResolvedUrls((prevState) => ({
      ...prevState, [`${folder}-${imgName}`]: result
    }))
  }

  const handleRowSelected = () => {
    setToggleCleared((prevState) => !prevState)
    console.log('triggered')
    //setToggleCleared((prevState) => !prevState)
  }

  useEffect(() => {
    console.log(toggleCleared)
  }, [toggleCleared])

  useEffect(() => {
    if (isEmpty(user)) {
      changeS3Content(null)
    }
    else if (!isEmpty(authConfig)) {
      console.log('fetching S3')
      Storage.list('', { level: 'private' })
        .then(result => {
          changeS3Content(result)
          _dataForTable = result.filter((obj) => {
            return (obj.key.endsWith('/') & obj.key.split('/').length === 2)
          }).map((obj, index) => {
            const folder = obj.key.split('/')[0]
            const rowDataContent = result.filter((obj) => {
              return (obj.key.startsWith(`${folder}/data/`) & !obj.key.endsWith('/'))
            }).map((obj) => {
              return (
                {
                  data: obj.key.split('/data/')[1],
                }
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
              id: `${index}`,
              folder: folder,
              rowData: rowDataContent,
              rowAnnotations: rowAnnotationsContent
            })
          })
          changeDataForTable(_dataForTable)
        })
        .catch(err => console.log(err))
    }
  }, [user])

  return (
    <SimpleDialog
      title="Select Project"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            console.log('adding samples')
          }
        }
      ]}
    >
      {!isEmpty(dataForTable) && (
        < DataTable
          expandableRows
          expandableRowsComponent={<ExpandedRow />}
          selectableRows
          selectableRowsHighlight
          selectableRowsNoSelectAll
          selectableRowsComponent={Radio}
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
