const times = (howManyTimes) => (functionWillExecute) => {
  if (howManyTimes > 0) {
    functionWillExecute()
    times(howManyTimes - 1)(functionWillExecute)
  }
}

const negative = {
  id: "negative",
  displayName: "offensive",
  description: "I felt negative things about that ",
}

const neutral = {
  id: "neutral",
  displayName: "neutral",
  description: "I don't feel anything about that",
}

const positive = {
  id: "positive",
  displayName: "lovely",
  description: "I felt positive things about that",
}

const inputValues = [positive, negative, neutral]

const textEntityClassification = () => {
  it("should be able to use text entity classification", () => {
    cy.contains("New File").click()

    cy.log("should import Elon Musk tweets from toy datasets")
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Elon Musk Tweets").siblings("td").eq(2).click()

    cy.log("should be able to go to 'Setup' and select 'Text Classification'")
    cy.get("#tab-setup").click()
    cy.contains("Text Classification").click()

    cy.log("should be able to clear labels before writing to them")
    //TODO: When added new tags to inputs make element selection more semantic
    cy.get("input[type=text]").each(($el, index, $list) => {
      if (index > 1 && inputValues[Math.floor((index - 2) / 3)]) {
        const currentValueGroupIndex = Math.floor((index - 2) / 3)
        const currentValueGroup = inputValues[currentValueGroupIndex]
        const currentValueIndex = (index - 2) % 3
        const currentValue = Object.values(currentValueGroup)[currentValueIndex]
        cy.get($el).focus().clear().type(currentValue)
      }
    })

    cy.log("should be able to go to samples")
    cy.get("#tab-samples").click()

    cy.log("should be able to start labeling texts")
    cy.get("div").contains("21").click()
    cy.get("div").contains("21").click()

    cy.log("should be able to show button descriptions on hover")
    cy.contains("lovely").trigger("mouseover")
    cy.contains("offensive").trigger("mouseover")
    cy.contains("neutral").trigger("mouseover")

    cy.log("should be able to label texts entities")
    times(4)(() => {
      cy.get("body").click().type("n")
      cy.get("body").click().type("{enter}")
    })

    cy.log("should be able to return samples tab")
    cy.get("#tab-samples").click()

    cy.log("should be able to show label tab")
    cy.get("#tab-label").click()
  })
}

export default textEntityClassification
