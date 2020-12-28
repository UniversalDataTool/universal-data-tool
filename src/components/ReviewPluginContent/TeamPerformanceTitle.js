import React from "react"
import {
  colors,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import moment from "moment"

const people = [
  { name: "Billy Acosta", email: "billyaacoasta@rhyta.com", role: "Admin" },
  {
    name: "Michael Reynolds",
    email: "MichaelCReynolds@rhyta.com",
    samplesReviewed: 11,
    role: "Reviewer",
  },
  { name: "Mary Pack", email: "marypack@rhyta.com", role: "Labeler" },
  { name: "William Pierce", email: "willp@rhyta.com", role: "Labeler" },
  { name: "Micheal Myers", email: "mmyers@rhyta.com", role: "Labeler" },
  { name: "Micheal Lyons", email: "mikelyons@rhyta.com", role: "Labeler" },
].map((a, i) => ({
  ...a,
  samplesLabeled: 2 + ((i * 17) % 7) ** 2,
  accuracy: 40 + (((2 + ((i * 17) % 7) ** 2) * 17.7) % 60),
  timePerLabel: Math.floor(Math.random() * 600) / 10,
}))

export const TeamPerformanceTable = () => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Samples Labeled</TableCell>
            <TableCell align="center">Samples Reviewed</TableCell>
            <TableCell align="center">Accuracy</TableCell>
            <TableCell align="center">Avg Time/Label</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((p, i) => (
            <TableRow key={i}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell align="center">{p.samplesLabeled}</TableCell>
              <TableCell align="center">{p.samplesReviewed || 0}</TableCell>
              <TableCell align="center">{p.accuracy.toFixed(1)}%</TableCell>
              <TableCell align="center">{p.timePerLabel.toFixed(1)}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default TeamPerformanceTable
