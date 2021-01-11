import React, { useState } from "react"
import {
  Box,
  CircularProgress,
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
import { useAddUser } from "udt-review-hooks"

export const AddUserDialog = (props) => {
  const addUser = useAddUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const { onClose, open } = props
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "labeler",
  })

  const onSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await addUser(userData)
      onClose()
    } catch (e) {
      setError(e.toString())
    }
    setLoading(false)
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
        {loading ? (
          <Box textAlign="center" p="32px">
            <CircularProgress size={50} />
          </Box>
        ) : (
          <Grid container spacing={1}>
            {error && (
              <Grid item xs={12}>
                <Box color="red" fontSize={18}>
                  {error}
                </Box>
              </Grid>
            )}
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
        )}
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
