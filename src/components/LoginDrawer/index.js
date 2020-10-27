import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"

import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import SignIn from "./SignIn"
import CompleteSignUp from "./CompleteSignUp"

import { useAuth } from "../../utils/auth-handlers/use-auth.js"

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

export default ({ loginDrawerOpen, onClose }) => {
  const classes = useStyles()

  const { user, isLoggedIn, error, handlerErrorVersion } = useAuth()

  const [state, setState] = useState({
    signingIn: true,
    completeSignUp: false,
    user: user,
  })

  useEffect(() => {
    if (isLoggedIn) {
      onClose()
      toggleSignIn()
    }
  }, [isLoggedIn, onClose])

  useEffect(() => {
    if (error === "NotAuthorizedException") {
      toggleSignIn()
    }
  }, [error, handlerErrorVersion])

  const toggleCompleteSignUp = () => {
    setState((prevState) => ({
      ...prevState,
      signingIn: false,
      completeSignUp: true,
      requiredAttributes: user.challengeParam.requiredAttributes,
    }))
  }

  const toggleSignIn = () => {
    setState((prevState) => ({
      ...prevState,
      signingIn: true,
      completeSignUp: false,
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
              <SignIn onRequireCompleteSignUp={() => toggleCompleteSignUp()} />
            )}
            {state.completeSignUp && (
              <CompleteSignUp toggleSignIn={toggleSignIn} />
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
