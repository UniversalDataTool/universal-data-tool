import createNewFile from "../utils/interface-test/create-new-file.spec"
import imageClassification from "../utils/interface-test/image-classification.spec"
import imageSegmentation from "../utils/interface-test/image-segmentation.spec"
import keyboardShortcuts from "../utils/interface-test/keyboard-shortcuts.spec"
import labelHelp from "../utils/interface-test/label-help.spec"
import namedEntityRecognition from "../utils/interface-test/named-entity-recognition.spec"
import pasteImageUrlsWithCSV from "../utils/interface-test/paste-image-urls-with-csv.spec"
import pasteImageUrls from "../utils/interface-test/paste-image-urls.spec"
import textEntityClassification from "../utils/interface-test/text-entity-classification.spec"

Cypress.config("defaultCommandTimeout", 3000)
describe("Udt test", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English")
      .type("{enter}")
  })
  createNewFile()
  imageClassification()
  imageSegmentation()
  keyboardShortcuts()
  labelHelp()
  namedEntityRecognition()
  pasteImageUrlsWithCSV()
  pasteImageUrls()
  textEntityClassification()
})
