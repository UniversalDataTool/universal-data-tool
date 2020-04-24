import React, { Fragment, useState } from "react"
import {
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import isEmpty from "../../utils/isEmpty"

import Amplify, { Auth } from "aws-amplify"

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default ({
  authConfig,
  onUserChange,
  onRequireCompleteSignUp,
  onClose,
}) => {
  Amplify.configure(authConfig)
  const classes = useStyles()

  const [state, setState] = useState({
    email: "",
    password: "",
    notAuthorizedException: false,
  })

  const handleSignInClick = () => {
    if (isEmpty(state.email) || isEmpty(state.password)) {
      setState((prevState) => ({
        ...prevState,
        notAuthorizedException: true,
      }))
    } else {
      SignInAWS(state.email, state.password)
    }
  }

  const handleTextFieldChange = (event) => {
    event.persist()
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
      notAuthorizedException: false,
    }))
  }

  ///useEffect(() => { }, [state.notAuthorizedException])

  async function SignInAWS(username, password) {
    await Auth.signIn(username, password).then(
      (user) => {
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          onRequireCompleteSignUp(user)
        } else {
          onUserChange(user)
          onClose()
        }
        return user
      },
      (err) => {
        if (err.code === "UserNotConfirmedException") {
          console.log("Must confirm the account")
          // The error happens if the user didn't finish the confirmation step when signing up
          // In this case you need to resend the code and confirm the user
          // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === "PasswordResetRequiredException") {
          console.log("Password has been reset")
          // The error happens when the password is reset in the Cognito console
          // In this case you need to call forgotPassword to reset the password
          // Please check the Forgot Password part.
        } else if (err.code === "NotAuthorizedException") {
          console.log("Bad password message")
          setState({ ...state, notAuthorizedException: true, password: "" })
          // The error happens when the incorrect password is provided
        } else if (err.code === "UserNotFoundException") {
          console.log("User not found message")
          // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
          console.log("Error that we do not handle for")
          console.log(err.code)
        }
        return err
      }
    )
  }

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          error={state.notAuthorizedException}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          helperText={
            state.notAuthorizedException
              ? "The email or password is incorrect."
              : ""
          }
          autoFocus
          onChange={handleTextFieldChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={state.password}
          onChange={handleTextFieldChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          onClick={handleSignInClick}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
      </form>
    </Fragment>
  )
}
