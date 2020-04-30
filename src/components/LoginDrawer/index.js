import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"

import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import SignIn from "./SignIn"
import CompleteSignUp from "./CompleteSignUp"

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 500,
  },
  root: {
    height: "100vh",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  close: {
    cursor: "pointer",
    color: theme.palette.secondary.main,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}))

export default ({ authConfig, loginDrawerOpen, onClose, onUserChange }) => {
  const classes = useStyles()

  const [state, setState] = useState({
    signingIn: true,
    completeSignUp: false,
    user: "",
  })

  const toggleCompleteSignUp = (user) => {
    setState((prevState) => ({
      ...prevState,
      signingIn: false,
      completeSignUp: true,
      user: user,
      requiredAttributes: user.challengeParam.requiredAttributes,
    }))
  }

  const drawer = () => (
    <div className={classes.drawer} role="presentation">
      <Grid container component="main" className={classes.root}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          component={Paper}
          elevation={6}
          square
        >
          <div className={classes.paper}>
            <Grid container>
              <Grid item xs>
                <ArrowForwardIcon onClick={onClose} className={classes.close} />
              </Grid>
            </Grid>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            {state.signingIn && (
              <SignIn
                authConfig={authConfig}
                onRequireCompleteSignUp={(user) => toggleCompleteSignUp(user)}
                onUserChange={onUserChange}
                onClose={onClose}
              />
            )}
            {state.completeSignUp && (
              <CompleteSignUp
                authConfig={authConfig}
                requiredAttributes={state.requiredAttributes}
                user={state.user}
                onClose={onClose}
                onUserChange={onUserChange}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )

  return (
    <>
      <Drawer anchor="right" open={loginDrawerOpen} onClose={onClose}>
        {drawer()}
      </Drawer>
    </>
  )
}
