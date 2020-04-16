// @flow weak
import React, { useState, useEffect } from "react"
import SimpleDialog from "../SimpleDialog"
import DataTable from "react-data-table-component"
import Radio from "@material-ui/core/Radio"

import Amplify, { Storage } from "aws-amplify"
import isEmpty from "../../utils/isEmpty"

const expandedDataColumns = [{ name: "Data", selector: "data", sortable: true }]

const expandedAnnotationsColumns = [
  { name: "Annotations", selector: "annotation" },
]

const columns = [{ name: "Projects", selector: "folder", sortable: true }]

const customStyles = {
  headCells: {
    style: {
      paddingLeft: '10px', 
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
  const [s3Content, changeS3Content] = useState(null)
  const [dataForTable, changeDataForTable] = useState(null)
  const [folderToFetch, setFolderToFetch] = useState("")

  let _dataForTable = {}

  function RecognizeFileExtension(UrlOfAFile){
    var typeOfFile = "File";
    var fileExtension =UrlOfAFile.match(`\\/([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`)[2].toLowerCase();
    if (fileExtension==="jpg"||fileExtension==="jpeg"||fileExtension==="png"
    ||fileExtension==="ico"||fileExtension==="jpe"||fileExtension==="gif")
      typeOfFile ="Image";
    if(fileExtension==="mp4"||fileExtension==="mkv")
      typeOfFile ="Video";
    if(fileExtension==="mp3")
      typeOfFile="Audio";
    return typeOfFile;
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
          if(RecognizeFileExtension(result)==="Image")
          {
            samples.push({ imageUrl: `${result}` });
          }else if (RecognizeFileExtension(result)==="Video"){
            samples.push({ videoUrl: `${result}` });
          }          
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
    var content=null;
    if(result.find(element => element.key===`${folderToFetch}/annotations/annotations.json`)){
      await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
        expires: 24 * 60 * 60*2000,
        level: "private",
      })
      .then(async (result) => {
        await fetch(result).then(async (data) =>{
          return await data.json().then(async (json) =>{
            if(typeof json.content != "undefined"){
              content=json.content;
            }            
          });
        })
      })
      .catch((err) => {
        console.log("error getting link for s3 image", err)
        return null
      });
    }
    return content;
  }

  const handleAddSample =  () => {
    Storage.list("", { level: "private" })
      .then(async (result) => {
        var samples = await GetImageFromAFolderAWS(result); 
        var content= await GetAnnotationFromAFolderAWS(result);
        if(content === null ||typeof content.taskOutput === "undefined"){
          onAddSamples(samples);
        }else{
          onAddSamples(samples,content.taskOutput,content);
        }
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
      Storage.list("", { level: "private" })
        .then((result) => {
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