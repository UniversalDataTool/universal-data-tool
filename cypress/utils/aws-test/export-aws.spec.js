import goToImportPage from "../go-to-import-page.spec"
import setTemplate from "../set-template.spec"
const testExportAssets = (name, lineToExpand, extensionToFind) => {
  goToImportPage()
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
  cy.contains(extensionToFind)
  cy.contains("Close").click()
}
const exportAWS = () => {
  it("Try to export with assets (Video)", () => {
    setTemplate("Video Segmentation")
    testExportAssets("CypressTestExportAssetsVideo", 1, "mp4")
  })

  it("Try to export with assets (Text)", () => {
    setTemplate("Text Classification")
    testExportAssets("CypressTestExportAssetsText", 1, "txt")
  })

  it("Try to export with assets (PDF)", () => {
    setTemplate("Data Entry")
    testExportAssets("CypressTestExportAssetsPDF", 1, "pdf")
  })

  it("Try to export with assets (Image)", () => {
    setTemplate("Image Classification")
    testExportAssets("CypressTestExportAssetsImage", 1, "jpg")
  })

  it("Try to export with assets (Audio)", () => {
    setTemplate("Audio Transcription")
    testExportAssets("CypressTestExportAssetsAudio", 1, "mp3")
  })

  it("Try to export a natif project to aws", () => {
    goToImportPage("Image Segmentation")
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
