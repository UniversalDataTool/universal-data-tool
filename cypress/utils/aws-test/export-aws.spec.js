import goToImportPage from "../go-to-import-page.spec"
import commandSetTemplate from "../cypress-command/set-template.spec"
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
  if (extensionToFind) cy.contains(extensionToFind)
  cy.contains("Load Annotations").click()
  cy.contains('Make sure the project has "samples" folder').should(
    "not.be.visible"
  )
  cy.contains("Close").click()
}

const testExportWithoutAssets = (nameProject, lineToExpand) => {
  goToImportPage()
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
const exportAWS = () => {
  commandSetTemplate()
  it("Try to export with assets (Video)", () => {
    cy.setTemplate("Video Segmentation")
    testExportAssets("CypressTestExportAssetsVideo", 0, "mp4")
  })

  it("Try to export with assets (Time:DataTime)", () => {
    cy.setTemplate("Time Series 2")
    testExportAssets("CypressTestExportAssetsTime2", 0, "json")
  })

  it("Try to export with assets (Time:AudioUrl)", () => {
    cy.setTemplate("Time Series")
    testExportAssets("CypressTestExportAssetsTime", 0, "mp3")
  })

  it("Try to export with assets (Text)", () => {
    cy.setTemplate("Text Classification")
    testExportAssets("CypressTestExportAssetsText", 0, "txt")
  })

  it("Try to export with assets (PDF)", () => {
    cy.setTemplate("Data Entry")
    testExportAssets("CypressTestExportAssetsPDF", 0, "pdf")
  })

  it("Try to export with assets (Image)", () => {
    cy.setTemplate("Image Classification")
    testExportAssets("CypressTestExportAssetsImage", 0, "jpg")
  })

  it("Try to export with assets (Audio)", () => {
    cy.setTemplate("Audio Transcription")
    testExportAssets("CypressTestExportAssetsAudio", 0, "mp3")
  })

  it("Try to export a project without assets (Video)", () => {
    cy.setTemplate("Video Segmentation")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyVideo", 0)
  })

  it("Try to export a project without assets (Time)", () => {
    cy.setTemplate("Time Series")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyTime", 0)
  })

  it("Try to export a project without assets (Text)", () => {
    cy.setTemplate("Text Classification")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyText", 0)
  })

  it("Try to export a project without assets (PDF)", () => {
    cy.setTemplate("Data Entry")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyPDF", 0)
  })

  it("Try to export a project without assets (Image)", () => {
    cy.setTemplate("Image Segmentation")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyImage", 0)
  })

  it("Try to export a project without assets (Audio)", () => {
    cy.setTemplate("Audio Transcription")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyAudio", 0)
  })
}
export default exportAWS
