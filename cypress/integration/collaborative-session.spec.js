import clickOn100SamplesInACollaborativeSession from "./utils/interface-test/click-on-100-samples-in-a-collaborative-session"
import createAndVisitCollaborativeSession from "./utils/interface-test/create-and-visit-collaborative-session"
Cypress.config("defaultCommandTimeout", 3000)
describe("Create and Visit Collaborative Session", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English")
      .type("{enter}")
    cy.contains("New File", { timeout: 50000 }).click()
  })
  createAndVisitCollaborativeSession()
  clickOn100SamplesInACollaborativeSession()
})
