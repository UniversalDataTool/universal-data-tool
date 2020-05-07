// @flow weak

import React, { useMemo, useState } from "react"
import DataTable from "react-data-table-component"
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
import SlideshowIcon from "@material-ui/icons/Slideshow"
import TableChartIcon from "@material-ui/icons/TableChart"
import Box from "@material-ui/core/Box"
import ImportIcon from "@material-ui/icons/Publish"
import ImportPage from "../ImportPage"
import TransformPage from "../TransformPage"
import useIsDesktop from "../../utils/use-is-desktop.js"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  padding: 16,
})

const SampleCounter = styled("div")({
  fontSize: 14,
  color: colors.grey[600],
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  flexGrow: 1,
})

const ExpandedRowContainer = styled("div")({
  padding: 8,
  border: "#888 solid 1px",
  borderTop: "none",
  borderRadius: 4,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: "inset 0 3px 3px rgba(0,0,0,0.2)",
})
const ExpandedRowTitle = styled("div")({
  fontSize: 11,
  fontWeight: "bold",
})
const ExpandedRowCode = styled("pre")({ whiteSpace: "pre-wrap", fontSize: 11 })

const ExpandedRow = ({ data }) => {
  const { annotation, ...input } = data

  return (
    <ExpandedRowContainer>
      <Grid spacing={2} container>
        <Grid item xs={6}>
          <ExpandedRowTitle>samples[{data.index}]:</ExpandedRowTitle>
          <ExpandedRowCode>{JSON.stringify(input, null, "  ")}</ExpandedRowCode>
        </Grid>
        <Grid item xs={6}>
          <ExpandedRowTitle>samples[{data.index}].annotation:</ExpandedRowTitle>
          <ExpandedRowCode>
            {JSON.stringify(annotation, null, "  ")}
          </ExpandedRowCode>
        </Grid>
      </Grid>
    </ExpandedRowContainer>
  )
}

export default ({
  file,
  oha,
  openSampleInputEditor,
  openSampleLabelEditor,
  deleteSample,
  onChangeOHA,
  onChangeFile,
  authConfig,
  user,
}) => {
  const isDesktop = useIsDesktop()
  const [currentTab, changeTabState] = useState(
    (oha.samples || []).length === 0
      ? "import"
      : window.localStorage.lastSampleTab || "grid"
  )
  const changeTab = (tab) => {
    changeTabState(tab)
    window.localStorage.lastSampleTab = tab
  }
  const columns = useMemo(() => {
    if (!oha.samples) return []
    const columns = [
      {
        name: "Index",
        selector: "index",
        sortable: true,
      },
    ]
    const knownKeys = new Set()
    for (const td of oha.samples) {
      for (const key in td) {
        if (!knownKeys.has(key)) {
          columns.push({
            name: key,
            selector: key,
          })
          knownKeys.add(key)
        }
      }
    }
    columns.push({
      name: "Edit",
      button: true,
      cell: (row) => (
        <IconButton raised onClick={() => openSampleInputEditor(row.index)}>
          <EditIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      ),
    })
    columns.push({
      name: "Label",
      button: true,
      cell: (row) => (
        <IconButton raised onClick={() => openSampleLabelEditor(row.index)}>
          <BorderColorIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      ),
    })
    columns.push({
      name: "Delete",
      button: true,
      cell: (row) => (
        <IconButton raised primary onClick={() => deleteSample(row.index)}>
          <DeleteIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      ),
    })
    return columns
  }, [oha.samples, deleteSample, openSampleInputEditor, openSampleLabelEditor])

  const data = useMemo(() => {
    if (!oha.samples) return []
    return oha.samples.map((td, i) => ({
      ...td,
      index: i,
    }))
  }, [oha.samples])
  return (
    <Container>
      <Box display="flex">
        <Tabs value={currentTab} onChange={(e, newTab) => changeTab(newTab)}>
          <Tab icon={<ImportIcon />} label="Import" value="import" />
          <Tab icon={<SlideshowIcon />} label="Transform" value="transform" />
          <Tab icon={<AppsIcon />} label="Grid" value="grid" />
          <Tab icon={<TableChartIcon />} label="Table" value="table" />
        </Tabs>
        <SampleCounter>
          {(oha.samples || []).length} Samples
          <br />
          {(oha.samples || []).filter((s) => s.annotation).length} Labels
        </SampleCounter>
      </Box>
      <Box paddingTop={2} />
      {currentTab === "import" && (
        <ImportPage
          file={file}
          isDesktop={isDesktop}
          onChangeFile={(file) => onChangeFile(file)}
          onImportPageShouldExit={() => changeTab("grid")}
          onChangeOHA={(newOHA) => onChangeOHA(newOHA)}
          oha={oha}
          authConfig={authConfig}
          user={user}
        />
      )}
      {currentTab === "transform" && (
        <TransformPage
          isDesktop={isDesktop}
          oha={oha}
          onChangeOHA={(oha, shouldViewChange) => {
            onChangeOHA(oha)
            if (shouldViewChange) {
              changeTab("grid")
            }
          }}
        />
      )}
      {currentTab === "grid" && (
        <SampleGrid
          count={(oha.samples || []).length}
          samples={oha.samples || []}
          completed={(oha.samples || []).filter((s) => s.annotation)}
          onClick={(sampleIndex) => {
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
