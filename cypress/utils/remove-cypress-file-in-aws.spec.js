import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"

const removeAWSFile = async (name) => {
  var credentials = Cypress.env()
  cy.log("Remove test files")
  cy.then(async () => {
    const authConfig = {
      Auth: {
        identityPoolId: credentials.AWS_IDENTITY_POOL_ID,
        region: credentials.AWS_AUTH_REGION,
        userPoolId: credentials.AWS_USER_POOL_ID,
        userPoolWebClientId: credentials.AWS_USER_POOL_WEB_CLIENT_ID,
        mandatorySignIn: credentials.AWS_MANDATORY_SIGN_IN,
        authenticationFlowType: credentials.AWS_AUTHENTICATION_FLOW_TYPE,
      },
      Storage: {
        AWSS3: {
          bucket: credentials.AWS_STORAGE_BUCKET,
          region: credentials.AWS_STORAGE_REGION,
        },
      },
    }
    const ds = await new datasetManagerCognito({ authConfig })
    await ds.removeProject(name)
  })
}

export default removeAWSFile
