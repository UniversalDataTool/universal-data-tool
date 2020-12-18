import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user.spec"
import setLanguage from "../../utils/set-language.spec"
import goToImportPage from "../../utils/go-to-import-page.spec"
import removeAWSFile from "../../utils/remove-cypress-file-in-aws.spec"
import addFileToAWS from "../../utils/add-cypress-file-to-aws.spec"
import addAssetsToAWS from "../../utils/add-cypress-assets-to-aws.spec"
import "regenerator-runtime/runtime"

//https://github.com/cypress-io/cypress/issues/461#issuecomment-325402086
let LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})
//////////When the issue is resolved change for the cypress solution////////////

describe("Import aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.wait(400)
    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    addFileToAWS("ImageClassification.json")
    addAssetsToAWS("Image Classification", "image1.jpg")
    addAssetsToAWS("Image Classification", "image2.jpg")
  })

  beforeEach("Go to import page", () => {
    cy.restoreLocalStorage()
    goToImportPage()
  })

  it("Check Header Warning", () => {
    cy.contains("Export to S3 (Cognito)").click()
    cy.get("input[id='ProjectName']")
      .focus()
      .clear()
      .type("Image Classification")
    cy.contains(
      "Warning : This project name already exist. If you continue the existing project with the same name will be replaced"
    )
    cy.contains("Close").click()
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Warning : You need to select a project.")
    cy.contains("Close").click()
  })

  afterEach("Check if project imported", () => {
    cy.saveLocalStorage()
    cy.get("button[title='Exit to Welcome Page']").click()
  })

  after("Clean AWS", () => {
    removeAWSFile("Image Classification")
  })
})
