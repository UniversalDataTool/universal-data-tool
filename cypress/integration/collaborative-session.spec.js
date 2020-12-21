import clickOn100SamplesInACollaborativeSession from "../utils/test/click-on-100-samples-in-a-collaborative-session.spec"
import createAndVisitCollaborativeSession from "../utils/test/create-and-visit-collaborative-session.spec"
import setLanguage from "../utils/set-language.spec"
Cypress.config("defaultCommandTimeout", 3000)
describe("Create and Visit Collaborative Session", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    setLanguage()
    cy.contains("New File").click()
  })
  createAndVisitCollaborativeSession()
  clickOn100SamplesInACollaborativeSession()
})
