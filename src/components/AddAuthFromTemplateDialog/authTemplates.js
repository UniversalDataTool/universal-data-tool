// @flow
import CognitoIcon from "./cognito-icon.js"
import SdStorageOutlinedIcon from "@material-ui/icons/SdStorageOutlined"
import AccountTreeIcon from "@material-ui/icons/AccountTree"

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
  {
    name: "Proxy",
    provider: "proxy",
    Icon: AccountTreeIcon,
  },
]
