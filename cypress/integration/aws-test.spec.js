import enterCredentialsCognitoS3 from "../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../utils/credentials-test/enter-credentials-user.spec"
import setLanguage from "../utils/set-language.spec"
import removeAWSFile from "../utils/remove-cypress-file-in-aws.spec"
import addFileToAWS from "../utils/add-cypress-file-to-aws.spec"
import addAssetsToAWS from "../utils/add-cypress-assets-to-aws.spec"
import warningHeader from "../utils/aws-test/warning-header.spec"
import exportAWS from "../utils/aws-test/export-aws.spec"
import importAWS from "../utils/aws-test/import-aws.spec"
import configImport from "../utils/aws-test/config-import.spec"
import configExport from "../utils/aws-test/config-export.spec"
import "regenerator-runtime/runtime"

//https://github.com/cypress-io/cypress/issues/461#issuecomment-325402086
let LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})
//////////When the issue is resolved change for the cypress solution////////////
Cypress.config("defaultCommandTimeout", 3000)
describe("Import aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    setLanguage()
    //the following are very long processus try to keep them here so they execute only once
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    cy.saveLocalStorage()
    addFileToAWS("ImageClassification.json")
    addAssetsToAWS("Image Classification", "image1.jpg")
    addAssetsToAWS("Image Classification", "image2.jpg")
    addAssetsToAWS("Audio Transcription", "audio.mp3")
    addAssetsToAWS("Video Segmentation", "video.mp4")
    addAssetsToAWS("Data Entry", "pdf1.pdf")
    addAssetsToAWS("Data Entry", "pdf2.pdf")
    addAssetsToAWS("Text Classification", "text1.txt")
    addAssetsToAWS("Text Classification", "text2.txt")
    addAssetsToAWS("Text Classification", "text3.txt")
    addFileToAWS("Empty.json")
    addFileToAWS("AudioTranscription.json")
    addFileToAWS("VideoSegmentation.json")
    addFileToAWS("TextClassification.json")
    addFileToAWS("TimeSeries.json")
    addFileToAWS("DataEntry.json")
    addFileToAWS("NotSupported.json")
    removeAWSFile("CypressTestExportAnnotationOnlyTime")
    removeAWSFile("CypressTestExportAnnotationOnlyImage")
    removeAWSFile("CypressTestExportAnnotationOnlyVideo")
    removeAWSFile("CypressTestExportAnnotationOnlyPDF")
    removeAWSFile("CypressTestExportAnnotationOnlyAudio")
    removeAWSFile("CypressTestExportAnnotationOnlyText")
    removeAWSFile("CypressTestExportAssetsTime")
    removeAWSFile("CypressTestExportAssetsImage")
    removeAWSFile("CypressTestExportAssetsVideo")
    removeAWSFile("CypressTestExportAssetsPDF")
    removeAWSFile("CypressTestExportAssetsAudio")
    removeAWSFile("CypressTestExportAssetsText")
  })

  beforeEach("Go to import page", () => {
    cy.restoreLocalStorage()
  })

  warningHeader()
  importAWS()
  configImport() //The comments in before/after goes with the one existing in this test
  configExport()
  exportAWS() //Always the last test aws change after this

  afterEach("Check if project imported", () => {
    cy.get("button[title='Exit to Welcome Page']").click({ force: true })
  })

  after("Clean AWS", () => {
    removeAWSFile("Image Classification")
    removeAWSFile("CypressTestExportAssetsImage")
    removeAWSFile("CypressTestExportAssetsVideo")
    removeAWSFile("CypressTestExportAssetsPDF")
    removeAWSFile("CypressTestExportAssetsAudio")
    removeAWSFile("CypressTestExportAssetsText")
    removeAWSFile("CypressTestExportAssetsTime")
    removeAWSFile("Not Supported")
    removeAWSFile("Time Series")
    removeAWSFile("Data Entry")
    removeAWSFile("Text Classification")
    removeAWSFile("Video Segmentation")
    removeAWSFile("Audio Transcription")
    removeAWSFile("Empty")
    removeAWSFile("CypressTestExportAnnotationOnlyTime")
    removeAWSFile("CypressTestExportAnnotationOnlyImage")
    removeAWSFile("CypressTestExportAnnotationOnlyVideo")
    removeAWSFile("CypressTestExportAnnotationOnlyPDF")
    removeAWSFile("CypressTestExportAnnotationOnlyAudio")
    removeAWSFile("CypressTestExportAnnotationOnlyText")
  })
})
