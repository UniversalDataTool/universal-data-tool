import goToImportPage from "../../utils/go-to-import-page.spec"

import multipleImport from "../../utils/aws-test/multiple-import-export.spec"

import commandLocalStorage from "../../utils/cypress-command/local-storage.spec"
import commandAddAssetToAwsProject from "../../utils/cypress-command/add-asset-to-aws-project.spec"
import commandCredentialsAws from "../../utils/cypress-command/credentials-aws.spec"
import commandAddProjectToAws from "../../utils/cypress-command/add-project-to-aws.spec"
import commandCleanAws from "../../utils/cypress-command/clean-aws.spec"
import commandSetLanguage from "../../utils/cypress-command/set-language.spec"

import "regenerator-runtime/runtime"

commandLocalStorage()
commandCredentialsAws()
commandAddAssetToAwsProject()
commandAddProjectToAws()
commandCleanAws()
commandSetLanguage()

Cypress.config("defaultCommandTimeout", 3000)
describe("Combination of import and export aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.setLanguage("en")
    //the following are very long processus try to keep them here so they execute only once
    cy.createCredentialsAws()
    cy.saveLocalStorage()
    cy.cleanAws()
    cy.addProjectToAws("ImageClassification.json")
    cy.addAssetToAwsProject("Image Classification", "image1.jpg")
    cy.addAssetToAwsProject("Image Classification", "image2.jpg")
  })

  beforeEach("Go to import page", () => {
    cy.restoreLocalStorage()
    goToImportPage("Image Classification")
  })

  multipleImport()

  //Comment below when debugging 1 test
  afterEach("Return to home page", () => {
    cy.get("button[title='Exit to Welcome Page']").click({ force: true })
  })

  //Comment below when debugging aws
  after("Clean AWS", () => {
    //cy.cleanAws()
  })
})
