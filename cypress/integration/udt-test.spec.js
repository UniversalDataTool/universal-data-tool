import createNewFile from "./utils/interface-test/create-new-file"
import imageClassification from "./utils/interface-test/image-classification"
import imageSegmentation from "./utils/interface-test/image-segmentation"
import keyboardShortcuts from "./utils/interface-test/keyboard-shortcuts"
import namedEntityRecognition from "./utils/interface-test/named-entity-recognition"
import pasteImageUrlsWithCSV from "./utils/interface-test/paste-image-urls-with-csv"
import pasteImageUrls from "./utils/interface-test/paste-image-urls"
import textEntityClassification from "./utils/interface-test/text-entity-classification"

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
  namedEntityRecognition()
  pasteImageUrlsWithCSV()
  pasteImageUrls()
  textEntityClassification()
})
