import goToImportPage from "../go-to-import-page.spec"
const importFromAnnotation = (
  nomProject,
  typeProject,
  numberSamples,
  numberRowToSelect
) => {
  goToImportPage(typeProject)
  cy.log("Import project")
  cy.contains("Import from S3 (Cognito)").click()
  cy.contains(nomProject, { timeout: 5000 }).click()
  cy.contains("Load Annotations").click()
  cy.get("input[name='select-row-" + numberRowToSelect + "']").click()
  cy.contains("Take samples from project").click()
  cy.contains("Grid", { timeout: 10000 }).click()
  cy.contains(numberSamples + " Samples")
  cy.contains("Import").click()
}
const importFromAssets = (
  nomProject,
  typeProject,
  numberSamples,
  numberRowToSelect
) => {
  goToImportPage(typeProject)
  cy.log("Import project")
  cy.contains("Import from S3 (Cognito)").click()
  cy.contains(nomProject, { timeout: 10000 }).click()
  cy.get("input[name='select-row-" + numberRowToSelect + "']").click()
  cy.contains("Take samples from project").click()
  cy.contains("Grid", { timeout: 10000 }).click()
  cy.contains(numberSamples + " Samples")
  cy.contains("Import").click()
}
const importAWS = () => {
  it("Try to import a project from annotations(Image)", () => {
    importFromAnnotation("Image Classification", "Image Classification", 2, 3)
  })
  it("Try to import a project from annotations(Video)", () => {
    importFromAnnotation("Video Segmentation", "Video Segmentation", 1, 7)
  })
  it("Try to import a project from annotations(Audio)", () => {
    importFromAnnotation("Audio Transcription", "Audio Transcription", 1, 0)
  })
  it("Try to import a project from annotations(PDF)", () => {
    importFromAnnotation("Data Entry", "Data Entry", 2, 1)
  })
  it("Try to import a project from annotations(Text)", () => {
    importFromAnnotation("Text Classification", "Text Classification", 3, 5)
  })

  it("Try to import a project from assets(Image)", () => {
    importFromAssets("Image Classification", "Image Classification", 2, 3)
  })
  it("Try to import a project from assets(Audio)", () => {
    importFromAssets("Audio Transcription", "Audio Transcription", 1, 0)
  })
  it("Try to import a project from assets(Video)", () => {
    importFromAssets("Video Segmentation", "Video Segmentation", 1, 7)
  })
  it("Try to import a project from assets(PDF)", () => {
    importFromAssets("Data Entry", "Data Entry", 2, 1)
  })
  it("Try to import a project from assets(Text)", () => {
    importFromAssets("Text Classification", "Text Classification", 3, 5)
  })
}
export default importAWS
