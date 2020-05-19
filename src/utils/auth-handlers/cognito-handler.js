import Amplify, { Auth } from "aws-amplify"

class CognitoHandler {
  authProvider = "cognito"
  constructor(appConfig) {
    this.authConfig = {
      Auth: {
        identityPoolId: appConfig["auth.cognito.identity_pool_id"],
        region: appConfig["auth.cognito.region"],
        userPoolId: appConfig["auth.cognito.user_pool_id"],
        userPoolWebClientId: appConfig["auth.cognito.user_pool_web_client_id"],
        mandatorySignIn: true,
        authenticationFlowType: "USER_PASSWORD_AUTH",
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
  setUser = (userHandle) => {
    this.user = userHandle
    this.isLoggedIn = Boolean(userHandle)
    this.hasChanged = true
  }
  login = async (tryUser) => {
    Amplify.configure(this.authConfig)

    const userHandle = await Auth.currentAuthenticatedUser()

    this.user = userHandle
    this.hasChanged = true
  }
  logout = () => {
    this.user = null
    this.isLoggedIn = false
    this.hasChanged = true
    Auth.signOut()
  }
  getState = () => ({
    user: this.user,
    isLoggedIn: this.isLoggedIn,
    authConfig: this.authConfig,
  })
}

export default CognitoHandler
