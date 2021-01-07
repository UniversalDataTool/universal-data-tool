import React, { useState } from "react"
import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  colors,
} from "@material-ui/core"

export const AddUserDialog = (props) => {
  const { onClose, open } = props
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "labeler",
  })

  const onSubmit = () => {
    // TODO:: submit user data
    onClose()
  }

  const onInputChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Add new user</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              required
              label="Name"
              name="name"
              value={userData.name}
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              name="email"
              value={userData.email}
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              select
              label="Role"
              name="role"
              value={userData.role}
              onChange={onInputChange}
              fullWidth
            >
              {["admin", "reviewer", "labeler"].map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary" variant="outlined">
          Submit
        </Button>
        <Button
          onClick={onClose}
          style={{
            borderColor: colors.red[200],
            color: colors.red[300],
          }}
          variant="outlined"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default AddUserDialog
