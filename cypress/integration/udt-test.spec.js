import createNewFile from "../utils/test/create-new-file.spec"
import imageClassification from "../utils/test/image-classification.spec"
import imageSegmentation from "../utils/test/image-segmentation.spec"
import keyboardShortcuts from "../utils/test/keyboard-shortcuts.spec"
import labelHelp from "../utils/test/label-help.spec"
import namedEntityRecognition from "../utils/test/named-entity-recognition.spec"
import pasteImageUrlsWithCSV from "../utils/test/paste-image-urls-with-csv.spec"
import pasteImageUrls from "../utils/test/paste-image-urls.spec"
import textEntityClassification from "../utils/test/text-entity-classification.spec"
import setLanguage from "../utils/set-language.spec"
import defaultTemplate from "../utils/test/default-template.spec"
import setTemplate from "../utils/set-template.spec"
import templateNonVisible from "../utils/test/template-non-visble.spec"
Cypress.config("defaultCommandTimeout", 3000)
describe("Udt test", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    setLanguage()
    setTemplate("Empty")
  })
  templateNonVisible()
  defaultTemplate()
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
