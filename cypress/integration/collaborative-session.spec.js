import clickOn100SamplesInACollaborativeSession from "../utils/test/click-on-100-samples-in-a-collaborative-session.spec"
import createAndVisitCollaborativeSession from "../utils/test/create-and-visit-collaborative-session.spec"
Cypress.config("defaultCommandTimeout", 3000)
describe("Create and Visit Collaborative Session", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English")
      .type("{enter}")
    cy.contains("New File").click()
  })
  clickOn100SamplesInACollaborativeSession()
  createAndVisitCollaborativeSession()
})
