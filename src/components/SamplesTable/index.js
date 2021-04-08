import React, { useMemo } from "react"
import IconButton from "@material-ui/core/IconButton"
import DataTable from "react-data-table-component"
import { styled } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import useSample from "../../hooks/use-sample"
import useSummary from "../../hooks/use-summary"
import useRemoveSamples from "../../hooks/use-remove-samples"
import DeleteIcon from "@material-ui/icons/Delete"
import BorderColorIcon from "@material-ui/icons/BorderColor"

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
  const { sample } = useSample(data._id)
  const { annotation, ...input } = sample || {}

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

export const SamplesTable = ({ onClickSample }) => {
  const { summary } = useSummary()
  const removeSamples = useRemoveSamples()
  const data = useMemo(() => {
    if (!summary?.samples) return []
    return summary.samples.map((td, i) => ({
      ...td,
      index: i,
    }))
  }, [summary])
  const columns = useMemo(() => {
    if (!summary || (summary?.samples || []).length === 0) return []
    const columns = [
      {
        name: "Index",
        selector: "index",
        sortable: true,
      },
    ]
    const knownKeys = new Set()
    for (const td of summary.samples) {
      for (const key in td) {
        if (!knownKeys.has(key)) {
          columns.push({
            name: key,
            selector: key,
            cell: (row) =>
              typeof row[key] !== "object"
                ? row[key]?.toString()
                : JSON.stringify(row[key]).slice(0, 30) + "...",
          })
          knownKeys.add(key)
        }
      }
    }
    // TODO "Edit" allows editing of the sample JSON
    // columns.push({
    //   name: "Edit",
    //   button: true,
    //   cell: (row) => (
    //     <IconButton raised onClick={() => onClickSample(row.index)}>
    //       <EditIcon style={{ width: 20, height: 20 }} />
    //     </IconButton>
    //   ),
    // })
    columns.push({
      name: "Label",
      button: true,
      cell: (row) => (
        <IconButton raised onClick={() => onClickSample(row.index)}>
          <BorderColorIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      ),
    })
    columns.push({
      name: "Delete",
      button: true,
      cell: (row) => (
        <IconButton raised primary onClick={() => removeSamples([row._id])}>
          <DeleteIcon style={{ width: 20, height: 20 }} />
        </IconButton>
      ),
    })
    return columns
  }, [summary, onClickSample, removeSamples])
  return (
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
  )
}

export default SamplesTable
