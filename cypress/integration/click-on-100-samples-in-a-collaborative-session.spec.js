Cypress.config("defaultCommandTimeout",3000)
describe.skip("Create and Visit Collaborative Session", () => {
  it("should be able to create new file", () => {
    cy.visit(`http://localhost:6001`)

    cy.contains("New File").click()
    cy.get("#tab-setup").click()
    cy.contains("Image Classification").click()
  })

  it("should be able to import cats dataset", () => {
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Cats").siblings("td").eq(2).click()
  })

  it("should be able to create new session", () => {})

  it("click on 100 samples", () => {
    cy.wait(2000)
    cy.get("#tab-label").click()
    cy.wait(2000)
    cy.contains("16").click()
    for (let i = 0; i < 50; i++) {
      cy.contains("valid").click()
      cy.contains("invalid").click()
    }
  })
})
