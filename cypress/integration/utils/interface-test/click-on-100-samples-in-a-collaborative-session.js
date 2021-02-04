const clickOn100SamplesInACollaborativeSession = () => {
  it.skip("Should be able to click on 100 samples in a collaborative session", () => {
    cy.get("#tab-setup").click()
    cy.contains("Image Classification").click()

    cy.log("should be able to import cats dataset")
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Cats").siblings("td").eq(2).click()

    cy.log("click on 100 samples")
    cy.get("#tab-label").click()
    cy.contains("16").click()
    for (let i = 0; i < 50; i++) {
      cy.contains("valid").click()
      cy.contains("invalid").click()
    }
  })
}

export default clickOn100SamplesInACollaborativeSession
