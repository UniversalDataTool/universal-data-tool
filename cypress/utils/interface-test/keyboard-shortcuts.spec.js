const keyboardShortcuts = () => {
  it.skip("Should be able to navigate to label tab with default shortcut", () => {
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
}

export default keyboardShortcuts
