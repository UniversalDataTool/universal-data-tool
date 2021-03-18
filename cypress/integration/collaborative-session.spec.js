import clickOn100SamplesInACollaborativeSession from "./utils/interface-test/click-on-100-samples-in-a-collaborative-session"
import createAndVisitCollaborativeSession from "./utils/interface-test/create-and-visit-collaborative-session"
import commandSetLanguage from "./utils/cypress-command/set-language"

commandSetLanguage()

Cypress.config("defaultCommandTimeout", 3000)
describe("Create and Visit Collaborative Session", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    cy.setLanguage("en")
    cy.contains("New File").click()
  })
  createAndVisitCollaborativeSession()
  clickOn100SamplesInACollaborativeSession()
})
