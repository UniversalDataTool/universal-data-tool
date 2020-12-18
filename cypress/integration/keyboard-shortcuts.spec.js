describe("Test default keyboard shortcuts", () => {
  it.skip("should be able to navigate to label tab with default shortcut", () => {
    cy.visit("/")
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English", { force: true })
      .type("{enter}")
    cy.contains("New File").click()

    // TODO this doesn't trigger hot keys for some reason, I'm not sure how
    // good the support for testing keyboard shortcuts in cypress is
    cy.get("body").trigger("keydown", {
      keyCode: 51,
      release: false,
      location: 0,
      which: 51,
      key: "3",
      code: "Digit3",
    })

    cy.contains("Percent Complete")
  })
})
