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
  it("Try to export with assets", () => {
    cy.log("Create project")
    cy.contains("Export to S3 (Cognito)").click()
    cy.get("input[id='ProjectName']")
      .clear()
      .type("CypressTest2")
      .type("{enter}")

    cy.log("set assets")
    cy.get("svg[id='SettingIcon']").click()
    cy.contains("Use a proxy").click()
    cy.get("input[id='proxy']")
      .clear()
      .type("https://cors-anywhere.herokuapp.com/")
      .type("{enter}")
    cy.get("svg[id='StorageIcon']").click()
    cy.contains("Create project").click()

    cy.log("Check if project created/list updated")
    cy.contains("Export to S3 (Cognito)", { timeout: 5000 }).click()
    cy.contains("CypressTest2")
    cy.contains("Close").click()
  })
}
export default exportAWS
