const test = () => {
  cy.log("should be able to go to the import page")
  cy.contains("New File").click()
  cy.contains("Image Segmentation").click()
  cy.get('button[id="tab-samples"]').click()
  cy.contains("Samples").click()
  cy.contains("Import").click()
}

export default test
