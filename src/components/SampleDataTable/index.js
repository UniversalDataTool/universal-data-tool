// @flow weak

import React, { useMemo } from "react"
import DataTable from "react-data-table-component"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({
  padding: 16
})

// [
//           {
//             name: "Index",
//             selector: "index",
//             sortable: true
//           },
//           {
//             name: "imageUrl",
//             selector: "imageUrl"
//           },
//           {
//             name: "Label",
//             button: true,
//             cell: () => (
//               <Button raised primary onClick={() => {}}>
//                 <EditIcon style={{ width: 20, height: 20, marginRight: 8 }} />
//                 Label
//               </Button>
//             )
//           }
//         ]

export default ({ oha, openSample }) => {
  const columns = useMemo(() => {
    if (!oha.taskData) return []
    const columns = [
      {
        name: "Index",
        selector: "index",
        sortable: true
      }
    ]
    const knownKeys = new Set()
    for (const td of oha.taskData) {
      for (const key in td) {
        if (!knownKeys.has(key)) {
          columns.push({
            name: key,
            selector: key
          })
          knownKeys.add(key)
        }
      }
    }
    columns.push({
      name: "Label",
      button: true,
      cell: row => (
        <Button raised primary onClick={() => openSample(row.index)}>
          <EditIcon style={{ width: 20, height: 20, marginRight: 8 }} />
          Label
        </Button>
      )
    })
    return columns
  }, [oha.taskData, oha.taskOutput])

  const data = useMemo(() => {
    if (!oha.taskData) return []
    return oha.taskData.map((td, i) => ({
      ...td,
      _output: oha.taskOutput && oha.taskOutput[i] ? oha.taskOutput[i] : {},
      index: i
    }))
  }, [oha.taskData, oha.taskOutput])
  return (
    <Container>
      <DataTable
        title="Samples"
        expandableRows
        dense
        columns={columns}
        data={data}
      />
    </Container>
  )
}
