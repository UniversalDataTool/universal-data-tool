import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user.spec"
import commandLocalStorage from "../../utils/cypress-command/local-storage.spec"
import commandSetLanguage from "../../utils/cypress-command/set-language.spec"
import "regenerator-runtime/runtime"

commandLocalStorage()
commandSetLanguage()

Cypress.config("defaultCommandTimeout", 3000)
describe("Credentials test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.setLanguage("en")
  })

  beforeEach("Restore local storage", () => {
    cy.restoreLocalStorage()
  })

  enterCredentialsCognitoS3()
  enterCredentialsUser()

  afterEach("Save local storage", () => {
    cy.saveLocalStorage()
  })
})
