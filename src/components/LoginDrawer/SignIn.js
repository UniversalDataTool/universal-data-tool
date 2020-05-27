import React, { Fragment, useState } from "react"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles } from "@material-ui/core/styles"
import isEmpty from "lodash/isEmpty"
import { styled } from "@material-ui/core/styles"

import { useTranslation } from "react-i18next"

import Amplify, { Auth } from "aws-amplify"
import * as colors from "@material-ui/core/colors"
import { useAuth } from "../../utils/auth-handlers/use-auth.js"

const ErrorText = styled("div")({
  padding: 16,
  color: colors.red[500],
})

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default ({ onUserChange, onRequireCompleteSignUp, onClose }) => {
  const { authConfig, setUser } = useAuth()
  const classes = useStyles()

  const [error, setError] = useState()
  const { t, i18n } = useTranslation()

  const [state, setState] = useState({
    username: "",
    password: "",
    notAuthorizedException: false,
  })

  const handleSignInClick = () => {
    if (isEmpty(state.username) || isEmpty(state.password)) {
      setState((prevState) => ({
        ...prevState,
        notAuthorizedException: true,
      }))
    } else {
      SignInAWS(state.username, state.password)
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

  async function SignInAWS(username, password) {
    setError(null)
    try {
      await Amplify.configure(authConfig)
      await Auth.signIn(username, password)
        .then((user) => {
          setUser(user)
          if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
            onRequireCompleteSignUp(user)
          } else {
            onUserChange(user)
            onClose()
          }
          return user
        })
        .catch((err) => {
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
            // The error happens when the supplied username/username does not exist in the Cognito user pool
          } else {
            console.log("Error that we do not handle for")
            console.log(err.code)
          }
          setError(err.toString())
          return err
        })
    } catch (e) {
      setError(e.toString())
    }
  }

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        {t("sign-in")}
      </Typography>
      {error && <ErrorText>{error}</ErrorText>}
      <form className={classes.form} noValidate>
        <TextField
          error={state.notAuthorizedException}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          helperText={
            state.notAuthorizedException
              ? "The username or password is incorrect."
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
          {t("sign-in")}
        </Button>
      </form>
    </Fragment>
  )
}
