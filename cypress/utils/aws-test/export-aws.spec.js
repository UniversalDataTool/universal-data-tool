import goToImportPage from "../go-to-import-page.spec"
import setTemplate from "../set-template.spec"
const testExportAssets=(name,lineToExpand,extensionToFind)=>{
  goToImportPage()
  cy.log("Create project")
  cy.contains("Export to S3 (Cognito)").click()
  cy.get("input[id='ProjectName']")
    .clear()
    .type(name)
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
cy.wait(2000)
  cy.log("Check if project created/list updated")
  cy.contains("Import from S3 (Cognito)", { timeout: 30000 }).click()
  cy.contains(name,{timeout: 15000})
  cy.get("button[data-testid='expander-button-"+lineToExpand+"']").click()
  cy.contains("Make sure the project has \"data\" folder").should("not.be.visible")
  cy.contains(extensionToFind)
  cy.contains("Close").click()
}
const exportAWS = () => {
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

  it("Try to export with assets (Video)", () => {
    setTemplate("Video Segmentation")
    testExportAssets("CypressTestExportAssetsVideo",2,"mp4")
  })

  it("Try to export with assets (PDF)", () => {
    setTemplate("Data Entry")
    testExportAssets("CypressTestExportAssetsPDF",2,"pdf")
  })

  it("Try to export with assets (Image)", () => {
    setTemplate("Image Classification")
    testExportAssets("CypressTestExportAssetsImage",2,"jpg")
  })

  it("Try to export with assets (Audio)", () => {
    setTemplate("Audio Transcription")
    testExportAssets("CypressTestExportAssetsAudio",2,"mp3")
  })
}
export default exportAWS
