import React, { Fragment, useState } from "react"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
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
  user,
  requiredAttributes,
  onUserChange,
  onClose,
}) => {
  Amplify.configure(authConfig)

  const requiredAttributesDict = {}
  const requiredAttributesErrorDict = {}
  requiredAttributes.forEach((requiredAttribute) => {
    requiredAttributesDict[requiredAttribute] = ""
    requiredAttributesErrorDict[requiredAttribute] = false
  })

  const [state, setState] = useState({
    newPassword: "",
    newPasswordNotValid: false,
    newPasswordConfirmation: "",
    newPasswordNotEqualsConfirmation: false,
    requiredAttributesDict: requiredAttributesDict,
    requiredAttributesErrorDict: requiredAttributesErrorDict,
  })

  const classes = useStyles()

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleCompleteSignUpClick = () => {
    if (
      checkIfPasswordEqualsConfirmationPassword() &&
      checkValidPassword() &&
      _handleCantBeNull("checkAll")
    ) {
      completeNewPassword()
    } else {
      console.log("Something missing")
    }

    /// completeNewPassword();
  }

  const _handleAttributesTextFieldChange = (event) => {
    setState({
      ...state,
      requiredAttributesDict: {
        ...state.requiredAttributesDict,
        [event.target.name]: event.target.value,
      },
    })
  }

  const _handleTextFieldChange = (event) => {
    setState({
      ...state,
      newPasswordNotValid: false,
      newPasswordNotEqualsConfirmation: false,
      [event.target.name]: event.target.value,
    })
  }

  const checkIfPasswordEqualsConfirmationPassword = () => {
    if (state.newPassword === state.newPasswordConfirmation) {
      setState({ ...state, newPasswordNotEqualsConfirmation: false })
      return true
    } else {
      setState({ ...state, newPasswordNotEqualsConfirmation: true })
      return false
    }
  }

  const checkValidPassword = () => {
    var validPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/
    if (state.newPassword.match(validPasswordRegex)) {
      setState({ ...state, newPasswordNotValid: false })
      return true
    } else {
      setState({ ...state, newPasswordNotValid: true })
      return false
    }
  }

  const _handleCantBeNull = (e) => {
    let allGood = true
    if (e === "checkAll") {
      requiredAttributes.forEach((requiredAttribute) => {
        if (state.requiredAttributesDict[requiredAttribute] === "") {
          setState({
            ...state,
            requiredAttributesErrorDict: {
              ...state.requiredAttributesErrorDict,
              [requiredAttribute]: true,
            },
          })
          allGood = false
        }
      })
    } else {
      if (e.target.value === "") {
        setState({
          ...state,
          requiredAttributesErrorDict: {
            ...state.requiredAttributesErrorDict,
            [e.target.name]: true,
          },
        })
      } else {
        setState({
          ...state,
          requiredAttributesErrorDict: {
            ...state.requiredAttributesErrorDict,
            [e.target.name]: false,
          },
        })
      }
    }
    return allGood
  }

  function completeNewPassword() {
    Auth.completeNewPassword(
      user, // the Cognito User Object
      state.newPassword, // the new password
      state.requiredAttributesDict
    )
      .then((user) => {
        onUserChange(user)
        onClose()
      })
      .catch((err) => {
        console.log("Setting ne password failled")
        console.log(err)
      })
  }

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Complete your Sign Up
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          error={state.newPasswordNotValid}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="newPassword"
          label="New password"
          type="password"
          id="password"
          value={state.newPassword}
          onChange={_handleTextFieldChange}
          onBlur={checkValidPassword}
          helperText={
            state.newPasswordNotValid
              ? "Password must have 8 characters, an uppercase letter and a digit"
              : ""
          }
        />
        <TextField
          error={state.newPasswordNotEqualsConfirmation}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="newPasswordConfirmation"
          label="Confirm new password"
          type="password"
          id="confirm-password"
          onChange={_handleTextFieldChange}
          value={state.newPasswordConfirmation}
          onBlur={checkIfPasswordEqualsConfirmationPassword}
          helperText={
            state.newPasswordNotEqualsConfirmation
              ? "New password and confirmation password must be the same"
              : ""
          }
        />
        {requiredAttributes.map((requiredAttribute) => {
          return (
            <TextField
              error={state.requiredAttributesErrorDict[requiredAttribute]}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name={requiredAttribute.toString()}
              key={requiredAttribute.toString()}
              label={capitalizeFirstLetter(requiredAttribute.toString())}
              type="text"
              id={requiredAttribute.toString()}
              onChange={_handleAttributesTextFieldChange}
              value={state.requiredAttributesDict.requiredAttribute}
              onBlur={_handleCantBeNull}
              helperText={
                state.requiredAttributesErrorDict[requiredAttribute]
                  ? `${capitalizeFirstLetter(
                      requiredAttribute.toString()
                    )} can't be null`
                  : ""
              }
            />
          )
        })}
        <Button
          onClick={handleCompleteSignUpClick}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Complete Sign Up
        </Button>
      </form>
    </Fragment>
  )
}
