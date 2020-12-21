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
    role: "Reviewer",
  },
  { name: "Mary Pack", email: "marypack@rhyta.com", role: "Labeler" },
  { name: "William Pierce", email: "willp@rhyta.com", role: "Labeler" },
  { name: "Micheal Myers", email: "mmyers@rhyta.com", role: "Labeler" },
  { name: "Micheal Lyons", email: "mikelyons@rhyta.com", role: "Labeler" },
].map((a, i) => ({
  ...a,
  lastActivity: Date.now() - (i / 16) ** 2 * 3 * 1000 * 60 * 60 * 48,
}))

export const TeamTable = () => {
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Last Activity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((p, i) => (
            <TableRow key={i}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Box width={74}>{p.role}</Box>
                  <EditIcon style={{ width: 14, height: 14, opacity: 0.5 }} />
                </Box>
              </TableCell>
              <TableCell>{moment(p.lastActivity).fromNow()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box padding={2} textAlign="right">
        <Button color="primary" variant="outlined">
          Add Team Member
        </Button>
        <Button
          style={{
            borderColor: colors.red[200],
            color: colors.red[300],
            marginLeft: 16,
          }}
          variant="outlined"
        >
          Remove Team Member
        </Button>
      </Box>
    </>
  )
}

export default TeamTable
