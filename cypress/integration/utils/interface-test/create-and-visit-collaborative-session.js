const createAndVisitCollaborativeSession = () => {
  let collaborationUrl
  it("Should be able to create and visit collaborative session", () => {
    cy.log("should be able to import Elon Musk Tweets dataset")
    cy.get("#tab-samples", { timeout: 5000 }).click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Elon Musk Tweets").siblings("td").eq(2).click()

    cy.log("should be able to create new session")
    cy.get("div[title='collaborate-icon']").click()
    cy.contains("Create New Session", { timeout: 5000 }).click()
    cy.contains("Leave Session", { timeout: 20000 })
    cy.get("div[title='collaborate-icon']").trigger("mouseleave")

    cy.log("should be able to store session url")
    cy.get("div[title='info-icon']", { timeout: 5000 }).click()
    cy.get("div[title='share-link']", { timeout: 20000 })
      .children()
      .children()
      .then((elements) => {
        collaborationUrl = Cypress.$(elements[0]).val()

        cy.log("should be able to go for session url")
        cy.visit(collaborationUrl)

        cy.log("should be able to navigate to samples")
        cy.get("#tab-samples").click()
      })
  })
}
export default createAndVisitCollaborativeSession
