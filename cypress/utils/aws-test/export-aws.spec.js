const exportAWS = () => {
  it("Try to export a natif project to aws", () => {
    cy.log("Create project")
    cy.contains("Export to S3 (Cognito)").click()
    cy.get("input[id='ProjectName']")
      .clear()
      .type("CypressTest1")
      .type("{enter}")
    cy.contains("Create project").click()

    cy.log("Check if project created/list updated")
    cy.contains("Export to S3 (Cognito)", { timeout: 5000 }).click()
    cy.contains("CypressTest1")
    cy.contains("Close").click()
  })
}
export default exportAWS
