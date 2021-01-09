import React, { useState } from "react"
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
import AddUserDialog from "./AddUserDialog"
import { useTeam } from "udt-premium-api-hook-lib"

export const TeamTable = () => {
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false)
  const { team } = useTeam()
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
          {team &&
            team.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box width={74}>{p.role}</Box>
                    <EditIcon style={{ width: 14, height: 14, opacity: 0.5 }} />
                  </Box>
                </TableCell>
                <TableCell>{moment(p.last_activity).fromNow()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Box padding={2} textAlign="right">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setOpenAddUserDialog(true)}
        >
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
      <AddUserDialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
      />
    </>
  )
}

export default TeamTable
