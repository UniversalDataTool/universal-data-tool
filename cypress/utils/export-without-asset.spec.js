const testExportWithoutAssets = (nameProject, lineToExpand) => {
  cy.log("Create project")
  cy.contains("Export to S3 (Cognito)").click()
  cy.get("input[id='ProjectName']").clear().type(nameProject).type("{enter}")
  cy.contains("Create project").click()
  cy.contains("Create project", { timeout: 120000 }).should("not.be.visible")

  cy.log("Check if project created/list updated")
  cy.contains("Import from S3 (Cognito)").click()
  cy.contains(nameProject, { timeout: 20000 })
  cy.get("button[data-testid='expander-button-" + lineToExpand + "']").click()
  cy.contains('Make sure the project has "data" folder').should("be.visible")
  cy.contains("Load Annotations").click()
  cy.contains('Make sure the project has "samples" folder').should(
    "not.be.visible"
  )
  cy.contains("Close").click()
}
export default testExportWithoutAssets
