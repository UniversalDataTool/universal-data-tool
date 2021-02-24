const times = (howManyTimes) => (functionWillExecute) => {
  if (howManyTimes > 0) {
    functionWillExecute()
    times(howManyTimes - 1)(functionWillExecute)
  }
}
const imageClassification = () => {
  it("Should be able to use image classification", () => {
    cy.contains("New File").click()

    cy.log("should be able to import face image dataset")
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("AI Generated Faces").siblings("td").eq(2).click()

    cy.log("should be able to setup image classification")
    cy.get("#tab-setup", { timeout: 5000 }).click()
    cy.contains("Image Classification").click()
    cy.get("input[value=valid]").eq(0).focus().clear().type("ai generated")
    cy.get("input[value=invalid]")
      .eq(0)
      .focus()
      .clear()
      .type("not ai generated")

    cy.log("should be able to see samples")
    cy.get("#tab-samples", { timeout: 5000 }).click()

    cy.log("should be able to open 21st sample")
    cy.contains("21").click()

    cy.log("should be able to label images")
    times(4)(() => {
      cy.get("body").click().type("n")
    })

    cy.log("should be able to return samples tab")
    cy.get("#tab-samples").click()

    cy.log("should be able to show label tab")
    cy.get("#tab-label").click()
  })
}

export default imageClassification
