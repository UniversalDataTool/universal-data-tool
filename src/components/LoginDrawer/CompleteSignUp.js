import React, { Fragment, useState } from "react"
import { Typography, TextField, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Auth } from "aws-amplify"
import { useAuth } from "../../utils/auth-handlers/use-auth.js"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default ({ requiredAttributes, onUserChange, onClose }) => {
  const { user } = useAuth()
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
      newPasswordError: null,
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
        setState({ ...state, newPasswordError: err.toString() })
      })
  }

  const { t } = useTranslation()

  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        {t("complete-your-sign-up")}
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
          helperText={state.newPasswordError || ""}
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
          {t("complete-sign-up")}
        </Button>
      </form>
    </Fragment>
  )
}
