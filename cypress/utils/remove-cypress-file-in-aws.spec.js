import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"

const removeAWSFile = (name) => {
  cy.fixture("credentials.json").then(async (credentials) => {
    const authConfig = {
      Auth: {
        identityPoolId: credentials.CYPRESS_AWS_IDENTITY_POOL_ID,
        region: credentials.CYPRESS_AWS_AUTH_REGION,
        userPoolId: credentials.CYPRESS_AWS_USER_POOL_ID,
        userPoolWebClientId: credentials.CYPRESS_AWS_USER_POOL_WEB_CLIENT_ID,
        mandatorySignIn: credentials.CYPRESS_AWS_MANDATORY_SIGN_IN,
        authenticationFlowType:
          credentials.CYPRESS_AWS_AUTHENTICATION_FLOW_TYPE,
      },
      Storage: {
        AWSS3: {
          bucket: credentials.CYPRESS_AWS_STORAGE_BUCKET,
          region: credentials.CYPRESS_AWS_STORAGE_REGION,
        },
      },
    }
    const ds = await new datasetManagerCognito({ authConfig })
    await ds.removeProject(name)
  })
}
export default removeAWSFile
