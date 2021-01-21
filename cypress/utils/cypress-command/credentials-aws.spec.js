import Amplify, { Auth } from "aws-amplify"

const command = () => {
  Cypress.Commands.add("createCredentialsAws", () => {
    cy.then({ timeout: 10000 }, async () => {
      const app_config = {
        "auth.cognito.identityPoolId": Cypress.env().AWS_IDENTITY_POOL_ID,
        "auth.cognito.region": Cypress.env().AWS_AUTH_REGION,
        "auth.cognito.userPoolId": Cypress.env().AWS_USER_POOL_ID,
        "auth.cognito.userPoolWebClientId": Cypress.env()
          .AWS_USER_POOL_WEB_CLIENT_ID,
        "auth.cognito.storage.awsS3.bucket": Cypress.env().AWS_STORAGE_BUCKET,
        "auth.cognito.storage.awsS3.region": Cypress.env().AWS_STORAGE_REGION,
        "auth.cognito.password.minimumLength": Cypress.env()
          .COGNITO_USER_PASS_LENGTH,
        "auth.cognito.password.requireLowercase":
          Cypress.env().COGNITO_USER_PASS_REQUIRE_LOWERCASE === "TRUE"
            ? true
            : false,
        "auth.cognito.password.requireUppercase":
          Cypress.env().COGNITO_USER_PASS_REQUIRE_UPPERCASE === "TRUE"
            ? true
            : false,
        "auth.cognito.password.requireNumbers":
          Cypress.env().COGNITO_USER_PASS_REQUIRE_NUMBER === "TRUE"
            ? true
            : false,
        "auth.cognito.password.requireSymbols":
          Cypress.env().COGNITO_USER_PASS_REQUIRE_SYMBOL === "TRUE"
            ? true
            : false,
        "auth.provider": "cognito",
        provider: "cognito",
      }
      const json = {
        Auth: {
          identityPoolId: Cypress.env().AWS_IDENTITY_POOL_ID,
          region: Cypress.env().AWS_AUTH_REGION,
          userPoolId: Cypress.env().AWS_USER_POOL_ID,
          userPoolWebClientId: Cypress.env().AWS_USER_POOL_WEB_CLIENT_ID,
          mandatorySignIn: true,
          authenticationFlowType: "USER_PASSWORD_AUTH",
          minimumLength: Cypress.env().COGNITO_USER_PASS_LENGTH,
          requireNumbers:
            Cypress.env().COGNITO_USER_PASS_REQUIRE_NUMBER === "TRUE"
              ? true
              : false,
          requireSymbols:
            Cypress.env().COGNITO_USER_PASS_REQUIRE_SYMBOL === "TRUE"
              ? true
              : false,
          requireUppercase:
            Cypress.env().COGNITO_USER_PASS_REQUIRE_UPPERCASE === "TRUE"
              ? true
              : false,
          requireLowercase:
            Cypress.env().COGNITO_USER_PASS_REQUIRE_LOWERCASE === "TRUE"
              ? true
              : false,
        },
        Storage: {
          AWSS3: {
            bucket: Cypress.env().AWS_STORAGE_BUCKET,
            region: Cypress.env().AWS_STORAGE_REGION,
          },
        },
      }
      localStorage.setItem("app_config", JSON.stringify(app_config))
      Amplify.configure(json)
      await Auth.signIn(
        Cypress.env().COGNITO_USER_NAME,
        Cypress.env().COGNITO_USER_PASS
      )
    })
    cy.reload()
  })
}
export default command
