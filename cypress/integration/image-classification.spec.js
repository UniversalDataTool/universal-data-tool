import setLanguage from "../utils/set-language"
const times = (howManyTimes) => (functionWillExecute) => {
  if (howManyTimes > 0) {
    functionWillExecute()
    times(howManyTimes - 1)(functionWillExecute)
  }
}

describe("Import ai generated faces and make image classification with them", () => {
  it("should be able to create", () => {
    cy.visit("/")
    setLanguage()
    cy.contains("New File").click()
  })

  it("should be able to import cat images dataset", () => {
    cy.contains("Samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("AI Generated Faces").siblings("td").eq(2).click()
  })

  it("should be able to setup image classification", () => {
    cy.contains("Setup").click()
    cy.contains("Image Classification").click()
    cy.get("input[value=valid]").eq(0).focus().clear().type("ai generated")
    cy.get("input[value=invalid]")
      .eq(0)
      .focus()
      .clear()
      .type("not ai generated")
  })

  it("should be able to see samples", () => {
    cy.contains("Samples").click()
  })

  it("should be able to open 21st sample", () => {
    cy.contains("21").click()
  })

  it("should be able to label images", () => {
    times(4)(() => {
      cy.get("body").click().type("n")
      cy.wait(250)
    })
  })

  it("should be able to return samples tab", () => {
    cy.contains("Samples").click()
    cy.wait(30)
  })

  it("should be able to show label tab", () => {
    cy.contains("Label").click()
  })
})
