// @flow

import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import authTemplates from "./authTemplates"
import SimpleDialog from "../SimpleDialog"
import isEmpty from "lodash/isEmpty"
import Survey from "material-survey/components/Survey"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../hooks/use-errors.js"
import Amplify from "aws-amplify"
import { useAppConfig } from "../AppConfig"
import * as colors from "@material-ui/core/colors"
import { useTranslation } from "react-i18next"

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
  howToSetupText: {
    padding: 16,
    color: colors.grey[600],
    "& a": {
      color: colors.blue[500],
      textDecoration: "none",
    },
  },
})

const forms = {
  cognito: {
    questions: [
      {
        name: "auth.cognito.identityPoolId",
        title: "Amazon Cognito Identity Pool ID",
        placeholder: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.region",
        title: "AWS Region",
        placeholder: "XX-XXXX-X",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.userPoolId",
        title: "Amazon Cognito User Pool ID",
        placeholder: "XX-XXXX-X_12ab34cd9",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.userPoolWebClientId",
        title: "Amazon Cognito Web Client ID",
        placeholder: "26-char alphanumeric string",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.storage.awsS3.bucket",
        title: "Bucket AWS",
        placeholder: "Name of the bucket",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.storage.awsS3.region",
        title: "Region of the bucket",
        placeholder: "XX-XXXX-X",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.cognito.password.minimumLength",
        title: "Minimum lenght of password",
        type: "text",
        isRequired: true,
        validators: [
          {
            maxValue: 99,
            minValue: 6,
            text: "Cognito allows password length to be between 6 and 99",
            type: "numeric",
          },
        ],
      },
      {
        name: "auth.cognito.password.requireLowercase",
        title: "Require a lowercase letter in password",
        type: "boolean",
        isRequired: true,
      },
      {
        name: "auth.cognito.password.requireUppercase",
        title: "Require a uppercase letter in password",
        type: "boolean",
        isRequired: true,
      },
      {
        name: "auth.cognito.password.requireNumbers",
        title: "Require a number in password",
        type: "boolean",
        isRequired: true,
      },
      {
        name: "auth.cognito.password.requireSymbols",
        title: "Require a symbol in password",
        type: "boolean",
        isRequired: true,
      },
    ],
  },
  s3iam: {
    questions: [
      {
        name: "auth.s3iam.accessKeyId",
        title: "Access Key ID",
        placeholder: "",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.s3iam.secretAccessKey",
        title: "Secret Access Key",
        placeholder: "",
        type: "text",
        isRequired: true,
      },
      {
        name: "auth.s3iam.region",
        title: "Region",
        placeholder: "us-east-1",
        type: "text",
        isRequired: true,
      },
    ],
  },
  proxy: {
    questions: [
      {
        name: "auth.proxy.corsproxy",
        type: "text",
        title: "CORS Proxy",
        description:
          "Some requests for images or APIs (like AWS S3) are blocked by browsers for security reasons, this CORs proxy will be used to enable blocked functionality when not using the desktop application.",
      },
    ],
  },
}

export default ({ open, onClose, onSelect, onFinish, onAuthConfigured }) => {
  const c = useStyles()
  const { t } = useTranslation()
  const [authProvider, setAuthProvider] = useState(null)
  const [dialogTitle, setDialogTitle] = useState(t("add-authentication"))
  const [errors, addError] = useErrors()
  const { appConfig, setAppConfig, fromConfig, setInConfig } = useAppConfig()

  const getDefaultsFromConfig = (form) => {
    const questionIds = form.questions.map((q) => q.name)
    const defaults = {}
    for (const questionId of questionIds) {
      const configValue = fromConfig(questionId)
      if (configValue !== undefined) {
        defaults[questionId] = configValue
      }
    }
    return defaults
  }

  // TODO useAppConfig to load in existing configuration

  const validateAuthProvider = async (answers) => {
    if (answers.provider === "cognito") {
      const config = {
        Auth: {
          identityPoolId: answers["auth.cognito.identityPoolId"],
          region: answers["auth.cognito.region"],
          userPoolId: answers["auth.cognito.userPoolId"],
          userPoolWebClientId: answers["auth.cognito.userPoolWebClientId"],
          mandatorySignIn: true,
          authenticationFlowType: "USER_PASSWORD_AUTH",
          minimumLength: answers["auth.cognito.password.minimumLength"],
          requireNumbers: answers["auth.cognito.password.requireNumbers"],
          requireSymbols: answers["auth.cognito.password.requireSymbols"],
          requireUppercase: answers["auth.cognito.password.requireUppercase"],
          requireLowercase: answers["auth.cognito.password.requireLowercase"],
        },
        Storage: {
          AWSS3: {
            bucket: answers["auth.cognito.storage.awsS3.bucket"],
            region: answers["auth.cognito.storage.awsS3.region"],
          },
        },
      }

      try {
        Amplify.configure(config)
      } catch (err) {
        addError("Invalid Cognito config: " + err.toString())
      }
    }
    setAppConfig({
      ...appConfig,
      ...answers,
      "auth.provider": answers.provider,
    })
    // TODO some kind of success message
    onClose()
    setAuthProvider(null)
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
              key={template.name}
              onClick={() => {
                setAuthProvider(template.provider)
                setDialogTitle(`${t("add-authentication")} ${template.name}`)
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
        {authProvider === "cognito" && (
          <div className={c.howToSetupText}>
            {t("check-this-wiki")}{" "}
            <a href="https://github.com/UniversalDataTool/universal-data-tool/wiki/Cognito---Amplify-Authentication-Setup-Instructions">
              {t("guide-to-set-up-cognito")}
            </a>
            .
          </div>
        )}
        {!isEmpty(authProvider) && forms[authProvider] && (
          <Survey
            variant="flat"
            form={forms[authProvider]}
            onQuestionChange={(questionId, newValue) => {
              setInConfig(questionId, newValue)
            }}
            completeText={t("complete")}
            onFinish={(answers) => {
              answers["provider"] = authProvider
              validateAuthProvider(answers)
            }}
            defaultAnswers={{
              ...getDefaultsFromConfig(forms[authProvider]),
              "auth.provider": fromConfig("auth.provider"),
            }}
          />
        )}
        <ErrorToasts errors={errors} />
      </SimpleDialog>
    </>
  )
}
