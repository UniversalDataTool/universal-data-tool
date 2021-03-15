import enterCredentialsCognitoS3 from "../utils/credentials-test/enter-credentials-cognito-s3"
import enterCredentialsUser from "../utils/credentials-test/enter-credentials-user"
import commandLocalStorage from "../utils/cypress-command/local-storage"
import commandSetLanguage from "../utils/cypress-command/set-language"
commandLocalStorage()
commandSetLanguage()

Cypress.config("defaultCommandTimeout", 3000)
if (Cypress.env().AWS_IDENTITY_POOL_ID)
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
