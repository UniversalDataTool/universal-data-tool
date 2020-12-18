const importAWS = () => {
  it("Try to import a project from annotations", () => {
    cy.log("Import project")
    cy.wait(400)
    cy.contains("Import from S3 (Cognito)").click()
    cy.wait(3000)
    cy.contains("Image Classification").click()
    cy.contains("Load Annotations").click()
    cy.get("input[name='select-row-0']").click()
    cy.contains("Take samples from project").click()
    cy.wait(8000)
    cy.contains("Grid").click()
    cy.contains("2 Samples")
    cy.contains("Import").click()
  })

  it("Try to import a project from assets", () => {
    cy.log("Import project")
    cy.wait(400)
    cy.contains("Import from S3 (Cognito)").click()
    cy.wait(3000)
    cy.contains("Image Classification").click()
    cy.get("input[name='select-row-0']").click()
    cy.contains("Take samples from project").click()
    cy.wait(8000)
    cy.contains("Grid").click()
    cy.contains("2 Samples")
    cy.contains("Import").click()
  })
}
export default importAWS
