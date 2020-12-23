const exportConfig = () => {
  it("Verification storage/setting panel", () => {
    cy.contains("Export to S3 (Cognito)").click()
    cy.contains("Assets processing").should("not.be")
    cy.get("svg[id='SettingIcon']").click()
    cy.contains("Assets processing")
    cy.get("svg[id='StorageIcon']").click()
    cy.contains("Assets processing").should("not.be")
    cy.contains("Close").click()
  })
}
export default exportConfig
