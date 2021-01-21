const testExportAssets = (name, lineToExpand, extensionToFind) => {
  cy.log("Create project")
  cy.contains("Export to S3 (Cognito)").click()
  cy.get("input[id='ProjectName']").clear().type(name).type("{enter}")

  cy.log("set assets")
  cy.get("svg[id='SettingIcon']").click()
  cy.contains("Use a proxy").click()
  cy.get("input[id='proxy']")
    .clear()
    .type("https://cors-anywhere.herokuapp.com/")
    .type("{enter}")
  cy.get("svg[id='StorageIcon']").click()
  cy.contains("Create project").click()
  cy.contains("Create project", { timeout: 120000 }).should("not.be.visible")

  cy.log("Check if project created/list updated")
  cy.contains("Import from S3 (Cognito)").click()
  cy.contains(name, { timeout: 15000 })
  cy.get("button[data-testid='expander-button-" + lineToExpand + "']").click()
  cy.contains('Make sure the project has "data" folder').should(
    "not.be.visible"
  )
  if (extensionToFind) cy.contains(extensionToFind)
  cy.contains("Load Annotations").click()
  cy.contains('Make sure the project has "samples" folder').should(
    "not.be.visible"
  )
  cy.contains("Close").click()
}

export default testExportAssets