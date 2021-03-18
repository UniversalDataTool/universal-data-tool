import datasetManagerCognito from "udt-dataset-managers/dist/CognitoDatasetManager"
import mime from "mime-types"
const command = () => {
  Cypress.Commands.add("addAssetToAwsProject", (nameProject, nameAsset) => {
    var credentials = Cypress.env()
    cy.log("Add test files : " + nameAsset)
    cy.fixture("assets-dummies/" + nameAsset, "base64").then(
      { timeout: 100000 },
      async (asset) => {
        var blob
        if (nameAsset.match(".*\\.json")) {
          blob = asset
        } else {
          blob = await Cypress.Blob.base64StringToBlob(
            asset,
            mime.lookup(nameAsset)
          )
        }
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
        ds.setProject(nameProject)
        await ds.addAsset(nameAsset, blob)
      }
    )
  })
}
export default command
