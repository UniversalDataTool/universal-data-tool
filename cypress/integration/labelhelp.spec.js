describe("Create a Label Help ", () => {
  it("should be able to use label help", () => {
    cy.visit("/")

    cy.contains("Start from Template").click()
    cy.contains("Image Classification").click()
    cy.contains("Samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.get('[data-import-toy-dataset-name="Cats"]').click()
    cy.contains("Label").click()
    cy.contains("Label Help").click()
    // This is a special api key that triggers mock functionality from the server
    // e.g. it always has 100 credits
    cy.get(".label-help-api-key-text-field").type(
      "7d773e8566102c1f971e1b52254e1749"
    )
    cy.contains("Save").click()
    cy.contains("Start Label Help").click()
  })
})
