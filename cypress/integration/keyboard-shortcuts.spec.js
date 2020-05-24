describe("Test default keyboard shortcuts", () => {
  it.skip("should be able to navigate to label tab with default shortcut", () => {
    cy.visit("http://localhost:6001")

    cy.contains("New File").click()

    cy.wait(500)

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
