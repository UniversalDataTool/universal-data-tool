describe("Create and Visit Collaborative Session", () => {
  it("should be able to create new file", () => {
    cy.visit(`http://localhost:6001`)
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English", { force: true })
      .type("{enter}")
    cy.contains("New File").click()
  })

  it("should be able to import Elon Musk Tweets dataset", () => {
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Elon Musk Tweets").siblings("td").eq(2).click()
  })

  it("should be able to create new session", () => {
    cy.get("div[title='collaborate-icon']").click()
    cy.contains("Create New Session").click()
    cy.contains("Leave Session",{timeout: 10000})
    cy.get("div[title='collaborate-icon']").trigger("mouseleave")
  })

  let collaborationUrl
  it("should be able to store session url", () => {
    cy.get("div[title='info-icon']").click()
    cy.get("div[title='share-link']", { timeout: 20000 })
      .children()
      .children()
      .then((elements) => {
        collaborationUrl = Cypress.$(elements[0]).val()
      })
  })

  it("should be able to go for session url", () => {
    cy.visit(collaborationUrl)
  })

  it("should be able to navigate to samples", () => {
    cy.get("#tab-samples").click()
  })
})
