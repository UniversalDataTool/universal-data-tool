const test = () => {
  cy.log("should be able to go to the import page")
  cy.contains("New File").click()
  cy.wait(200)
  cy.contains("Image Segmentation").click({ force: true })
  cy.wait(200)
  cy.get('button[id="tab-samples"]').click()
  cy.contains("Samples").click()
  cy.wait(200)
  cy.contains("Import").click()
}

export default test
