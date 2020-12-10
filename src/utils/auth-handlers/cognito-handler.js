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
        minimumLength: appConfig["auth.cognito.password.minimumLength"],
        requireNumbers: appConfig["auth.cognito.password.requireNumbers"],
        requireSymbols: appConfig["auth.cognito.password.requireSymbols"],
        requireUppercase: appConfig["auth.cognito.password.requireUppercase"],
        requireLowercase: appConfig["auth.cognito.password.requireLowercase"],
      },
      Storage: {
        AWSS3: {
          bucket: appConfig["auth.cognito.storage.awsS3.bucket"],
          region: appConfig["auth.cognito.storage.awsS3.region"],
        },
      },
    }
    this.isLoggedIn = false
    this.isChallenged = false
    this.checkIfLoggedIn()
  }
  checkIfLoggedIn = async () => {
    Amplify.configure(this.authConfig)
    const userHandle = await Auth.currentAuthenticatedUser().catch(() => {})
    if (userHandle) {
      this.user = userHandle
      this.isLoggedIn = true
      this.hasChanged = true
    }
  }
  setUser = (userHandle) => {
    this.user = userHandle
    if (userHandle.challengeName === "NEW_PASSWORD_REQUIRED") {
      this.isChallenged = true
    } else {
      this.isLoggedIn = Boolean(userHandle)
      this.isChallenged = false
    }
    this.hasChanged = true
    this.error = null
  }
  login = async (username, password) => {
    await Auth.signIn(username, password)
      .then((user) => {
        this.setUser(user)
      })
      .catch((err) => {
        this.handleCognitoError(err)
      })
  }
  logout = () => {
    this.user = null
    this.error = null
    this.isLoggedIn = false
    this.isChallenged = false
    this.hasChanged = true
    Auth.signOut()
  }
  completeSignUp = async (password, requiredAttributesDict) => {
    Auth.completeNewPassword(
      this.user, // the Cognito User Object
      password, // the new password
      requiredAttributesDict
    )
      .then((user) => {
        this.setUser(user)
      })
      .catch((err) => {
        this.handleCognitoError(err)
      })
  }
  getState = () => ({
    user: this.user,
    isLoggedIn: this.isLoggedIn,
    authConfig: this.authConfig,
    isChallenged: this.isChallenged,
    error: this.error,
  })
  handleCognitoError = (err) => {
    if (err.code === "UserNotConfirmedException") {
      console.log("Must confirm the account")
      this.error = err.code
      // The error happens if the user didn't finish the confirmation step when signing up
      // In this case you need to resend the code and confirm the user
      // About how to resend the code and confirm the user, please check the signUp part
    } else if (err.code === "PasswordResetRequiredException") {
      console.log("Password has been reset")
      this.error = err.code
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      // Please check the Forgot Password part.
    } else if (err.code === "NotAuthorizedException") {
      console.log("Bad password message")
      this.error = err.code
      //setState({ ...state, notAuthorizedException: true, password: "" })
      // The error happens when the incorrect password is provided
    } else if (err.code === "UserNotFoundException") {
      this.error = err.code
      console.log("User not found message")
      // The error happens when the supplied username/username does not exist in the Cognito user pool
    } else if (err.code === "InvalidPasswordException") {
      this.error = err.code
      console.log("Invalid password")
      // The error happens when the password is not conforming to Cognito Policy
    } else {
      this.error = err.code
      console.log("Error that we do not handle for:")
      console.log(err.code)
    }
    this.errorOccured = true
  }
  passwordValidator = (password) => {
    const validations = {
      isValid: true,
      validationsMessages: [],
    }
    if (this.authConfig.Auth.requireLowercase) {
      const lowercaseReg = new RegExp(/.*[a-z].*/)
      if (lowercaseReg.test(password)) {
        validations.validationsMessages.push({
          isValid: true,
          key: "requireLowercase",
          message: `Password must contain a lower case letter`,
        })
      } else {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "requireLowercase",
          message: `Password must contain a lower case letter`,
        })
      }
    }
    if (this.authConfig.Auth.requireUppercase) {
      const uppercaseReg = new RegExp(/.*[A-Z].*/)
      if (uppercaseReg.test(password)) {
        validations.validationsMessages.push({
          isValid: true,
          key: "requireUppercase",
          message: `Password must contain an upper case letter`,
        })
      } else {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "requireUppercase",
          message: `Password must contain an upper case letter`,
        })
      }
    }
    if (this.authConfig.Auth.requireNumbers) {
      const numbersReg = new RegExp(/.*[0-9].*/)
      if (numbersReg.test(password)) {
        validations.validationsMessages.push({
          isValid: true,
          key: "requireNumbers",
          message: `Password must contain a number`,
        })
      } else {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "requireNumbers",
          message: `Password must contain a number`,
        })
      }
    }
    if (this.authConfig.Auth.requireSymbols) {
      const symbolsReg = new RegExp(/.*[=+\-^$*.[\]{}()?"!@#%&/\\,><':;|_~`].*/)
      if (symbolsReg.test(password)) {
        validations.validationsMessages.push({
          isValid: true,
          key: "requireSymbols",
          message: `Password must contain a special character`,
        })
      } else {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "requireSymbols",
          message: `Password must contain a special character`,
        })
      }
    }
    if (Boolean(this.authConfig.Auth.minimumLength)) {
      if (password.length >= parseInt(this.authConfig.Auth.minimumLength)) {
        validations.validationsMessages.push({
          isValid: true,
          key: "minimumLength",
          message: `Password must contain at least ${this.authConfig.Auth.minimumLength} characters`,
        })
      } else {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "minimumLength",
          message: `Password must contain at least ${this.authConfig.Auth.minimumLength} characters`,
        })
      }
      if (password.length > 99) {
        validations.isValid = false
        validations.validationsMessages.push({
          isValid: false,
          key: "maximum",
          message: `Password must not contain more than 99 characters`,
        })
      }
    }
    return validations
  }
}

export default CognitoHandler
