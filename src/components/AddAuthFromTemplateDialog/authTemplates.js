// @flow
import React from "react"
import CognitoIcon from "./cognito-icon.js"
import SdStorageOutlinedIcon from "@material-ui/icons/SdStorageOutlined"

export default [
  {
    name: "AWS - Cognito",
    provider: "cognito",
    Icon: CognitoIcon,
  },
  {
    name: "AWS - S3 (IAM)",
    provider: "s3iam",
    Icon: SdStorageOutlinedIcon,
  },
]
