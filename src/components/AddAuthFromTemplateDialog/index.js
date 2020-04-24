// @flow

import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import { makeStyles } from "@material-ui/core/styles"
import authTemplates from "./authTemplates"
import { grey } from "@material-ui/core/colors"
import SimpleDialog from "../SimpleDialog"
import isEmpty from "../../utils/isEmpty"
import Survey from "material-survey/components/Survey"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import Amplify, { Auth } from "aws-amplify"

const useStyles = makeStyles({
  bigButton: {
    padding: 10,
    width: 150,
    height: 120,
    border: "1px solid #ccc",
    margin: 10,
  },
  bigIcon: {
    width: 48,
    height: 48,
  },
  cognitoIcon: {
    width: 48,
    height: 48,
  },
})

const forms = {
  AWS: {
    questions: [
      {
        name: "identityPoolId",
        title: "Amazon Cognito Identity Pool ID",
        placeholder: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
        type: "text",
        isRequired: true,
      },
      {
        name: "region",
        title: "AWS Region",
        placeholder: "XX-XXXX-X",
        type: "text",
        isRequired: true,
      },
      {
        name: "userPoolId",
        title: "Amazon Cognito User Pool ID",
        placeholder: "XX-XXXX-X_12ab34cd9",
        type: "text",
        isRequired: true,
      },
      {
        name: "userPoolWebClientId",
        title: "Amazon Cognito Web Client ID",
        placeholder: "26-char alphanumeric string",
        type: "text",
        isRequired: true,
      },
    ],
  },
}

export default ({ open, onClose, onSelect, onFinish, onAuthConfigured }) => {
  const c = useStyles()
  const [authProvider, setAuthProvider] = useState(null)
  const [dialogTitle, setDialogTitle] = useState("Add Authentification")
  const [errors, addError] = useErrors()

  const validateAuthProvider = (answers) => {
    if (answers.provider === "AWS") {
      const config = {
        Auth: {
          identityPoolId: answers.identityPoolId,
          region: answers.region,
          userPoolId: answers.userPoolId,
          userPoolWebClientId: answers.userPoolWebClientId,
          mandatorySignIn: true,
          authenticationFlowType: "USER_PASSWORD_AUTH",
        },
      }
      try {
        Amplify.configure(config)
        Auth.currentAuthenticatedUser()
          .then((user) => {
            onAuthConfigured(config)
            onClose()
          })
          .catch((err) => {
            onAuthConfigured(config)
            onClose()
          })
      } catch (err) {
        addError("Invalid Cognito config")
      }
    }
  }

  return (
    <>
      <SimpleDialog
        title={dialogTitle}
        open={open}
        onClose={() => {
          onClose()
        }}
        onFinish={onFinish}
      >
        {isEmpty(authProvider) &&
          authTemplates.map((template, i) => (
            <Button
              key={i}
              onClick={() => {
                setAuthProvider(template.provider)
                setDialogTitle(`Add Authentification for ${template.name}`)
              }}
              className={c.bigButton}
            >
              <div>
                <div>{template.name}</div>
                <div>
                  <template.Icon className={c.cognitoIcon} />
                </div>
              </div>
            </Button>
          ))}

        {!isEmpty(authProvider) && forms[authProvider] && (
          <Survey
            variant="flat"
            form={forms[authProvider]}
            onFinish={(answers) => {
              answers["provider"] = authProvider
              validateAuthProvider(answers)
            }}
          />
        )}
        <ErrorToasts errors={errors} />
      </SimpleDialog>
    </>
  )
}
