import Amplify, { Auth } from "aws-amplify"

class CognitoHandler {
  authProvider = "cognito"
  constructor(appConfig) {
    this.authConfig = {
      Auth: {
        identityPoolId: appConfig["auth.cognito.identityPoolId"],
        region: appConfig["auth.cognito.region"],
        userPoolId: appConfig["auth.cognito.userPoolId"],
        userPoolWebClientId: appConfig["auth.cognito.userPoolWebClientId"],
        mandatorySignIn: true,
        authenticationFlowType: "USER_PASSWORD_AUTH",
      },
      Storage: {
        AWSS3: {
          bucket: appConfig["auth.cognito.storage.awsS3.bucket"],
          region: appConfig["auth.cognito.storage.awsS3.region"],
        },
      },
    }
    this.isLoggedIn = false
    this.checkIfLoggedIn()
  }
  checkIfLoggedIn = async () => {
    Amplify.configure(this.authConfig)
    const userHandle = await Auth.currentAuthenticatedUser()
    if (userHandle) {
      this.user = userHandle
      this.isLoggedIn = true
      this.hasChanged = true
    }
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
