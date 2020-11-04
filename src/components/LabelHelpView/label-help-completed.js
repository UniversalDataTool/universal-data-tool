import React from "react"

import Box from "@material-ui/core/Box"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import Button from "@material-ui/core/Button"

import useDatasetProperty from "../../hooks/use-dataset-property"

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export const LabelHelpCompleted = ({ onChangeActiveStep }) => {
  const { labelHelp, updateLabelHelp } = useDatasetProperty("labelHelp")
  return (
    <Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Percent Complete</TableCell>
            <TableCell>100%</TableCell>
          </TableRow>
          {labelHelp?.totalCost && (
            <TableRow>
              <TableCell>Total Cost</TableCell>
              <TableCell>{usdFormatter.format(labelHelp?.totalCost)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box display="flex" marginTop={2} justifyContent="flex-end">
        <Button
          onClick={() => {
            updateLabelHelp(null)
            onChangeActiveStep("setup")
          }}
          variant="outlined"
        >
          Restart
        </Button>
        {/* TODO sync samples merges samples from link */}
        {/* <Button
      style={{ marginLeft: 12 }}
      variant="outlined"
      color="primary"
    >
      Sync Samples
    </Button> */}
      </Box>
    </Box>
  )
}

export default LabelHelpCompleted
