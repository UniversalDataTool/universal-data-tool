import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user.spec"
import setLanguage from "../../utils/set-language.spec"
import goToImportPage from "../../utils/go-to-import-page.spec"
import removeAWSFile from "../../utils/remove-cypress-file-in-aws.spec"
import addFileToAWS from "../../utils/add-cypress-file-to-aws.spec"
import "regenerator-runtime/runtime"
describe("Import aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.wait(400)
    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    goToImportPage()
    addFileToAWS("samples-dummies/ImageClassification.json")
  })

  it("Try to import a project from aws", () => {
    cy.log("Import project")
    cy.wait(400)
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Image Classification").click()
    cy.contains("Load Annotations").click()
    cy.get("input[name='select-row-0']").click()
    cy.contains("Take samples from project").click()
    cy.wait(8000)

    cy.log("Check if project imported")
    cy.contains("Grid").click()
    cy.contains("0")
    cy.contains("Import").click()
  })

  after("Clean AWS", () => {
    removeAWSFile("Image Classification")
  })
})
