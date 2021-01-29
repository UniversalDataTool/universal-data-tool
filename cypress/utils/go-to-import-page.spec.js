const test = (typeProject) => {
  cy.log("should be able to go to the import page")
  cy.contains("New File").click()
  if (typeProject) cy.contains(typeProject).click()
  cy.get('button[id="tab-samples"]').click()
  cy.contains("Samples").click()
  cy.contains("Import").click()
}

export default test
