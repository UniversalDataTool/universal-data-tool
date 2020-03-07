// @flow weak

import React, { useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import { styled } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import SampleGrid from "../SampleGrid"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import AppsIcon from "@material-ui/icons/Apps"
import TableChartIcon from "@material-ui/icons/TableChart"
import Box from "@material-ui/core/Box"
import ImportIcon from "@material-ui/icons/Publish"
import ImportPage from "../ImportPage"
import useIsDesktop from "../../utils/use-is-desktop.js"

const Container = styled("div")({
  padding: 16
})

const ExpandedRowContainer = styled("div")({
  padding: 8,
  border: "#888 solid 1px",
  borderTop: "none",
  borderRadius: 4,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: "inset 0 3px 3px rgba(0,0,0,0.2)"
})
const ExpandedRowTitle = styled("div")({
  fontSize: 11,
  fontWeight: "bold"
})
const ExpandedRowCode = styled("pre")({ whiteSpace: "pre-wrap", fontSize: 11 })

const ExpandedRow = ({ data }) => {
  const { _output, ...input } = data

  return (
    <ExpandedRowContainer>
      <Grid spacing={2} container>
        <Grid item xs={6}>
          <ExpandedRowTitle>taskData[{data.index}]:</ExpandedRowTitle>
          <ExpandedRowCode>{JSON.stringify(input, null, "  ")}</ExpandedRowCode>
        </Grid>
        <Grid item xs={6}>
          <ExpandedRowTitle>taskOutput[{data.index}]:</ExpandedRowTitle>
          <ExpandedRowCode>
            {JSON.stringify(_output, null, "  ")}
          </ExpandedRowCode>
        </Grid>
      </Grid>
    </ExpandedRowContainer>
  )
}

export default ({
  oha,
  openSampleInputEditor,
  openSampleLabelEditor,
  deleteSample,
  onChangeOHA
}) => {
  const isDesktop = useIsDesktop()
  const [currentTab, changeTabState] = useState(
    window.localStorage.lastSampleTab || "grid"
  )
  const changeTab = tab => {
    changeTabState(tab)
    window.localStorage.lastSampleTab = tab
  }
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
      name: "Edit",
      button: true,
      cell: row => (
        <IconButton
          raised
          primary
          onClick={() => openSampleInputEditor(row.index)}
        >
          <EditIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      )
    })
    columns.push({
      name: "Label",
      button: true,
      cell: row => (
        <IconButton
          raised
          primary
          onClick={() => openSampleLabelEditor(row.index)}
        >
          <BorderColorIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      )
    })
    columns.push({
      name: "Delete",
      button: true,
      cell: row => (
        <IconButton raised primary onClick={() => deleteSample(row.index)}>
          <DeleteIcon style={{ width: 20, height: 20 }} />
        </IconButton>
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
      <Tabs value={currentTab} onChange={(e, newTab) => changeTab(newTab)}>
        <Tab icon={<ImportIcon />} label="Import" value="import" />
        <Tab icon={<AppsIcon />} label="Grid" value="grid" />
        <Tab icon={<TableChartIcon />} label="Table" value="table" />
      </Tabs>
      <Box paddingTop={2} />
      {currentTab === "import" && (
        <ImportPage
          isDesktop={isDesktop}
          onChangeOHA={(newOHA, shouldViewChange) => {
            onChangeOHA(newOHA)
            if (shouldViewChange) {
              changeTab("grid")
            }
          }}
          oha={oha}
        />
      )}
      {currentTab === "grid" && (
        <SampleGrid
          count={(oha.taskData || []).length}
          completed={(oha.taskOutput || []).map(Boolean)}
          onClick={sampleIndex => {
            openSampleLabelEditor(sampleIndex)
          }}
        />
      )}
      {currentTab === "table" && (
        <DataTable
          title="Samples"
          expandableRowsComponent={<ExpandedRow />}
          expandableRows
          dense
          columns={columns}
          data={data}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 25, 50, 100, 200]}
        />
      )}
    </Container>
  )
}
