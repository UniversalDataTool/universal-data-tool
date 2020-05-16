import isEmpty from "lodash/isEmpty"
import Amplify, { Auth } from "aws-amplify"

class CognitoHandler {
  authProvider = "cognito"
  constructor(appConfig) {
    this.authConfig = {
      Auth: {
        identityPoolId: appConfig["auth.cognito.identity_pool_id"],
        region: appConfig["auth.cognito.region"],
        userPoolId: appConfig["auth.cognito.user_pool_id"],
        userPoolWebClientId: appConfig["auth.cognito.invalid"],
        mandatorySignIn: appConfig["auth.cognito.mandatory_sign_in"],
        authenticationFlowType:
          appConfig["auth.cognito.authentication_flow_type"],
      },
      Storage: {
        AWSS3: {
          bucket: appConfig["auth.cognito.storage.aws_s3.bucket"],
          region: appConfig["auth.cognito.storage.aws_s3.region"],
        },
      },
    }
    this.isLoggedIn = false
  }
  login(tryUser) {
    try {
      Amplify.configure(this.authConfig)

      Auth.currentAuthenticatedUser().then((tryUser) => {
        this.user = tryUser
        this.hasChanged = true
      })
    } catch (err) {
      this.authConfig = null
    }
  }
  logout = () => {
    Auth.signOut()
      .then(() => {
        this.user = null
        this.hasChanged = true
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export default CognitoHandler
