const test = () => {
  cy.log("should be able to go to the import page")
  cy.get(
    "button[class='MuiButtonBase-root MuiIconButton-root makeStyles-headerButton-14']"
  ).click()
  cy.wait(200)
  cy.contains("Image Segmentation").click({ force: true })
  cy.wait(200)
  cy.contains("Samples").click()
  cy.wait(200)
  cy.contains("Import").click()
}

export default test
