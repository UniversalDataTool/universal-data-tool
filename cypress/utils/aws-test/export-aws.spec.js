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

  cy.log("Check if project created/list updated")
  cy.contains("Import from S3 (Cognito)", { timeout: 40000 }).click()
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
  it("Try to export with assets (Video)", () => {
    setTemplate("Video Segmentation")
    testExportAssets("CypressTestExportAssetsVideo", 1, "mp4")
  })

  it("Try to export with assets (Time:DataTime)", () => {
    setTemplate("Time Series 2")
    testExportAssets("CypressTestExportAssetsTime2", 1, "json")
  })

  it("Try to export with assets (Time:AudioUrl)", () => {
    setTemplate("Time Series")
    testExportAssets("CypressTestExportAssetsTime", 1, "mp3")
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

  it("Try to export a project without assets (Video)", () => {
    setTemplate("Video Segmentation")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyVideo", 1)
  })

  it("Try to export a project without assets (Time)", () => {
    setTemplate("Time Series")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyTime", 1)
  })

  it("Try to export a project without assets (Text)", () => {
    setTemplate("Text Classification")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyText", 1)
  })

  it("Try to export a project without assets (PDF)", () => {
    setTemplate("Data Entry")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyPDF", 1)
  })

  it("Try to export a project without assets (Image)", () => {
    setTemplate("Image Segmentation")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyImage", 1)
  })

  it("Try to export a project without assets (Audio)", () => {
    setTemplate("Audio Transcription")
    testExportWithoutAssets("CypressTestExportAnnotationOnlyAudio", 1)
  })
}
export default exportAWS
