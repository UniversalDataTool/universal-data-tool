import warningHeader from "../../utils/aws-test/warning-header-export.spec"
import exportAWS from "../../utils/aws-test/export-aws.spec"
import configExport from "../../utils/aws-test/config-export.spec"

import commandSetLanguage from "../../utils/cypress-command/set-language.spec"
import commandLocalStorage from "../../utils/cypress-command/local-storage.spec"
import commandAddAssetToAwsProject from "../../utils/cypress-command/add-asset-to-aws-project.spec"
import commandCredentialsAws from "../../utils/cypress-command/credentials-aws.spec"
import commandAddProjectToAws from "../../utils/cypress-command/add-project-to-aws.spec"
import commandCleanAws from "../../utils/cypress-command/clean-aws.spec"

import "regenerator-runtime/runtime"

commandLocalStorage()
commandCredentialsAws()
commandAddAssetToAwsProject()
commandAddProjectToAws()
commandCleanAws()
commandSetLanguage()

Cypress.config("defaultCommandTimeout", 3000)
describe("Export aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.createCredentialsAws()
    cy.setLanguage("en")
    cy.saveLocalStorage()
    cy.cleanAws()
    cy.addProjectToAws("ImageClassification.json")
    cy.addAssetToAwsProject("Image Classification", "image1.jpg")
  })

  beforeEach("Go to import page", () => {
    cy.restoreLocalStorage()
  })

  warningHeader()
  configExport()
  exportAWS() //Always the last test. Aws change after this

  //Comment below when debugging 1 test
  afterEach("Return to home page", () => {
    cy.get("button[title='Exit to Welcome Page']").click({ force: true })
  })

  //Comment below when debugging aws
  after("Clean AWS", () => {
    cy.cleanAws()
  })
})
