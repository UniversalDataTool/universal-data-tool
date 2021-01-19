import commandAddAssetToAwsProject from "../../utils/cypress-command/add-asset-to-aws-project.spec"
import commandAddProjectToAws from "../../utils/cypress-command/add-project-to-aws.spec"
const command = () => {
  commandAddAssetToAwsProject()
  commandAddProjectToAws()
  Cypress.Commands.add("setUpAws", () => {
    cy.addProjectToAws("ImageClassification.json")
    cy.addProjectToAws("Empty.json")
    cy.addProjectToAws("AudioTranscription.json")
    cy.addProjectToAws("VideoSegmentation.json")
    cy.addProjectToAws("TextClassification.json")
    cy.addProjectToAws("TimeSeriesTimeData.json")
    cy.addProjectToAws("TimeSeriesAudioUrl.json")
    cy.addProjectToAws("DataEntry.json")
    cy.addProjectToAws("NotSupported.json")
    cy.addAssetToAwsProject("Image Classification", "image1.jpg")
    cy.addAssetToAwsProject("Image Classification", "image2.jpg")
    cy.addAssetToAwsProject("Audio Transcription", "audio.mp3")
    cy.addAssetToAwsProject("Video Segmentation", "video.mp4")
    cy.addAssetToAwsProject("Data Entry", "pdf1.pdf")
    cy.addAssetToAwsProject("Data Entry", "pdf2.pdf")
    cy.addAssetToAwsProject("Text Classification", "text1.txt")
    cy.addAssetToAwsProject("Text Classification", "text2.txt")
    cy.addAssetToAwsProject("Text Classification", "text3.txt")
    cy.addAssetToAwsProject("Time Series", "audio.mp3")
    cy.addAssetToAwsProject("Time Series 2", "timeSeries.json")
  })
}
export default command
