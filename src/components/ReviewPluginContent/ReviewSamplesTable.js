import React from "react"
import {
  TextField,
  InputAdornment,
  colors,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
} from "@material-ui/core"
import Title from "./Title"
import CheckIcon from "@material-ui/icons/Check"
import SearchIcon from "@material-ui/icons/Search"
import moment from "moment"

const samples = [
  {
    worksSubmitted: 3,
    worksNeeded: 3,
    confidence: 100,
    reviewed: true,
  },
  {
    worksSubmitted: 2,
    worksNeeded: 3,
    confidence: 94.4,
    reviewed: false,
  },
  {
    worksSubmitted: 2,
    worksNeeded: 3,
    confidence: 100,
    reviewed: true,
  },
  {
    worksSubmitted: 1,
    worksNeeded: 3,
    confidence: 70.3,
    reviewed: false,
  },
  {
    worksSubmitted: 1,
    worksNeeded: 1,
    confidence: 91.3,
  },
  {
    worksSubmitted: 0,
    worksNeeded: 1,
    confidence: 0,
  },
  {
    worksSubmitted: 0,
    worksNeeded: 1,
    confidence: 0,
  },
  {
    worksSubmitted: 0,
    worksNeeded: 3,
    confidence: 0,
  },
  {
    worksSubmitted: 0,
    worksNeeded: 3,
    confidence: 0,
  },
].map((a, i) => ({
  ...a,
  index: i,
  lastActivity: Date.now() - (i / 16) ** 2 * 3 * 1000 * 60 * 60 * 48,
}))

export const ReviewSamplesTable = ({ selectedItem }) => {
  return (
    <>
      <Title>Samples</Title>
      <Box display="flex" padding={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by sample number or labeler"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: colors.grey[500] }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>SN</TableCell>
            <TableCell align="center">Consensus</TableCell>
            <TableCell align="center">Confidence</TableCell>
            <TableCell align="center">Reviewed</TableCell>
            <TableCell>Last Activity</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {samples
            .filter((s) =>
              selectedItem === "Needs Review"
                ? !s.reviewed
                : selectedItem === "Complete"
                ? s.worksSubmitted >= s.worksNeeded
                : true
            )
            .map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.index}</TableCell>
                <TableCell align="center">
                  {s.worksSubmitted} / {s.worksNeeded}
                </TableCell>
                <TableCell align="center">{s.confidence.toFixed(1)}%</TableCell>
                <TableCell align="center">
                  {s.reviewed ? <CheckIcon /> : null}
                </TableCell>
                <TableCell>{moment(s.lastActivity).fromNow()}</TableCell>
                <TableCell>
                  <Button>View</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ReviewSamplesTable
