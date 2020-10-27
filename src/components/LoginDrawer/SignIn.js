import React, { Fragment, useState, useEffect } from "react"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles } from "@material-ui/core/styles"
import isEmpty from "lodash/isEmpty"
import { styled } from "@material-ui/core/styles"

import { useTranslation } from "react-i18next"

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

export default ({ onRequireCompleteSignUp }) => {
  const { user, login, error, handlerErrorVersion } = useAuth()
  const classes = useStyles()

  const [errorMessage, setErrorMessage] = useState()
  const { t } = useTranslation()

  const [state, setState] = useState({
    username: "",
    password: "",
    notAuthorizedException: false,
  })

  useEffect(() => {
    if (Boolean(user) && user.challengeName) {
      onRequireCompleteSignUp()
    }
  }, [user, onRequireCompleteSignUp])

  useEffect(() => {
    if (error === "NotAuthorizedException") {
      setState((prevState) => ({
        ...prevState,
        notAuthorizedException: true,
      }))
    }
  }, [error, handlerErrorVersion, setState])

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
    setErrorMessage(null)
    try {
      login(username, password)
    } catch (e) {
      setErrorMessage(e.toString())
    }
  }

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        {t("sign-in")}
      </Typography>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <form className={classes.form} noValidate>
        <TextField
          error={state.notAuthorizedException}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label={t("username")}
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
          error={state.notAuthorizedException}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type="password"
          id="password"
          autoComplete="current-password"
          value={state.password}
          onChange={handleTextFieldChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label={t("remember-me")}
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
