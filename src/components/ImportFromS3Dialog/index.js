// @flow weak
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import Radio from "@material-ui/core/Radio"

import Amplify, { Storage } from "aws-amplify"
import isEmpty from "../../utils/isEmpty"

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300,
})

const expandedDataColumns = [{ name: "Data", selector: "data", sortable: true }]

const expandedAnnotationsColumns = [
  { name: "Annotations", selector: "annotation" },
]

const columns = [{ name: "Projects", selector: "folder", sortable: true }]

const customStyles = {
  headCells: {
    style: {
      paddingLeft: '10px', // override the cell padding for head cells
    },
  },
  cells: {
    style: {
      paddingLeft: '25px'
    }
  }
}

const ExpandedRow = ({ data }) => {
  const { rowData, rowAnnotations, ...notImportant } = data

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
        noDataComponent='Make sure the project has "annotations" folder'
        pagination={rowData.length > 10}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        customStyles={customStyles}
      />
      <DataTable
        style={{
          boxSizing: "border-box",
          paddingLeft: "50px",
          paddingRight: "10px",
        }}
        dense
        striped
        noHeader
        columns={expandedDataColumns}
        data={rowData}
        noDataComponent={'Make sure the project has "data" folder'}
        pagination={rowData.length > 10}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        customStyles={customStyles}
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
  const [toggleCleared, setToggleCleared] = useState(false)
  const [displayTable, setDisplayTable] = useState(false)
  const [folderToFetch, setFolderToFetch] = useState("")

  let _dataForTable = {}

  const addImageUrl = (result, folder, imgName) => {
    changeResolvedUrls((prevState) => ({
      ...prevState,
      [`${folder}-${imgName}`]: result,
    }))
  }
  async function GetImageFromAFolderAWS(result){
    var samples = [];
    for (let i=0; i<result.length;i++){
      if(result[i].key.match(`(${folderToFetch}/data).*(\\.).*`)){
        await Storage.get(result[i].key, {
          expires: 24 * 60 * 60*2000,
          level: "private",
        })
        .then((result) => {
          samples.push({ imageUrl: `${result}` });
        })
        .catch((err) => {
          console.log("error getting link for s3 image", err)
          return null
        });
      }
    } 
    return samples;
  }

  async function GetAnnotationFromAFolderAWS(result){
    var annotation=null;
    if(result.find(element => element.key===`${folderToFetch}/annotations/annotations.json`)){
      await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
        expires: 24 * 60 * 60*2000,
        level: "private",
      })
      .then(async (result) => {
        await fetch(result).then(async (data) =>{
          return await data.json().then(async (json) =>{
            if(typeof json.content.taskOutput != "undefined"){
              annotation=json.content.taskOutput;
            }            
          });
        })
      })
      .catch((err) => {
        console.log("error getting link for s3 image", err)
        return null
      });
    }
    return annotation;
  }

  const handleAddSample =  () => {
    Storage.list("", { level: "private" })
      .then(async (result) => {
        var samples = await GetImageFromAFolderAWS(result); 
        var annotation= await GetAnnotationFromAFolderAWS(result);
        onAddSamples(samples,annotation);
      })
      .catch((err) => {
        console.log("error getting link for s3 image", err)
        return null
      })
    }

  const handleRowSelected = (whatsChanging) => {
    if (!isEmpty(whatsChanging.selectedRows[0])) {
      setFolderToFetch(whatsChanging.selectedRows[0].folder)
      changeDataForTable((prevState) =>
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
      setFolderToFetch(null)
      changeDataForTable((prevState) =>
        prevState.map((row) => {
          row.isSelected = false
          return row
        })
      )
    }
  }

  useEffect(() => {
  }, [dataForTable])

  useEffect(() => {
    if (isEmpty(user)) {
      changeS3Content(null)
    } else if (!isEmpty(authConfig)) {
      console.log("fetching S3")
      Storage.list("", { level: "private" })
        .then((result) => {
          console.log(result);
          changeS3Content(result)
          _dataForTable = result
            .filter((obj) => {
              return obj.key.endsWith("/") & (obj.key.split("/").length === 2)
            })
            .map((obj, index) => {
              const folder = obj.key.split("/")[0]
              const rowDataContent = result
                .filter((obj) => {
                  return (
                    obj.key.startsWith(`${folder}/data/`) &
                    !obj.key.endsWith("/")
                  )
                })
                .map((obj) => {
                  return {
                    data: obj.key.split("/data/")[1],
                  }
                })
              const rowAnnotationsContent = result
                .filter((obj) => {
                  return (
                    obj.key.startsWith(`${folder}/annotations/`) &
                    !obj.key.endsWith("/")
                  )
                })
                .map((obj) => {
                  return { annotation: obj.key.split("/annotations/")[1] }
                })
              return {
                id: `${index}`,
                folder: folder,
                rowData: rowDataContent,
                rowAnnotations: rowAnnotationsContent,
                isSelected: true,
              }
            })
          changeDataForTable(_dataForTable)
        })
        .catch((err) => console.log(err))
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
            handleAddSample()
          },
        },
      ]}
    >
      {!isEmpty(dataForTable) && (
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
          data={dataForTable}
          pagination={dataForTable.length > 10}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        />
      )}
    </SimpleDialog>
  )
}
