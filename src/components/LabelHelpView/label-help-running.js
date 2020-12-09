import React, { useState } from "react"

import Box from "@material-ui/core/Box"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableRow from "@material-ui/core/TableRow"
import TableCell from "@material-ui/core/TableCell"
import CircularProgress from "@material-ui/core/CircularProgress"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import useDatasetProperty from "../../hooks/use-dataset-property"
import useAsyncEffect from "use-async-effect"

import useAppConfig from "../../hooks/use-app-config"

const Link = styled("a")({
  color: colors.blue[500],
  textDecoration: "none",
})

export const LabelHelpRunning = ({ onChangeActiveStep }) => {
  const [status, setStatus] = useState()
  const [progress, setProgress] = useState()

  const [loading, setLoading] = useState(true)
  const { fromConfig } = useAppConfig()
  const { labelHelp } = useDatasetProperty("labelHelp")
  const labelHelpUrl = labelHelp?.url
  const price = labelHelp?.totalCost

  useAsyncEffect(async () => {
    if (!labelHelpUrl) return
    const response = await fetch(
      `https://labelhelp.universaldatatool.com/api/job?custom_id=${encodeURIComponent(
        labelHelpUrl
      )}&api_key=${fromConfig("labelhelp.apikey")}`
    ).then(async (r) => {
      if (!r.ok) {
        alert(`Error loading job: ${await r.text()}`)
        throw r
      }
      return await r.json()
    })
    if (response.progress >= 1) {
      onChangeActiveStep("completed")
    } else {
      setProgress(response.progress)
      setStatus(response.status)
      setLoading(true)
    }
  }, [labelHelpUrl])

  return (
    <Box>
      {loading ? (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Link</TableCell>
              <TableCell>
                <Link href={labelHelpUrl}>{labelHelpUrl}</Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Percent Complete</TableCell>
              <TableCell>{(progress || 0).toFixed(1)}%</TableCell>
            </TableRow>
            {price && (
              <TableRow>
                <TableCell>Budget Used</TableCell>
                <TableCell>${(progress || 0) * (price || 0)} / $75</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <Box padding={8} textAlign="center">
          <CircularProgress size={100} />
        </Box>
      )}
      <Box display="flex" marginTop={2} justifyContent="flex-end">
        {/* TODO add stop early by calling /api/stop */}
        {/* <Button
      variant="outlined"
      style={{
        color: colors.red[500],
        border: `1px solid ${colors.red[200]}`,
      }}
    >
      Stop Early
    </Button> */}
        <Box flexGrow={1} />
        {/* TODO sync samples merges samples from link */}
        {/* <Button variant="outlined" color="primary">
      Sync Samples
    </Button> */}
      </Box>
    </Box>
  )
}

export default LabelHelpRunning
