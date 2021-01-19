import createNewFile from "../utils/test/create-new-file.spec"
import imageClassification from "../utils/test/image-classification.spec"
import imageSegmentation from "../utils/test/image-segmentation.spec"
import keyboardShortcuts from "../utils/test/keyboard-shortcuts.spec"
import labelHelp from "../utils/test/label-help.spec"
import namedEntityRecognition from "../utils/test/named-entity-recognition.spec"
import pasteImageUrlsWithCSV from "../utils/test/paste-image-urls-with-csv.spec"
import pasteImageUrls from "../utils/test/paste-image-urls.spec"
import textEntityClassification from "../utils/test/text-entity-classification.spec"
import defaultTemplate from "../utils/test/default-template.spec"
import commandSetTemplate from "../utils/cypress-command/set-template.spec"
import templateNonVisible from "../utils/test/template-non-visble.spec"
import languageBoxTest from "../utils/test/language-box.spec"
import commandSetLanguage from "../utils/cypress-command/set-language.spec"

commandSetLanguage()
commandSetTemplate()

Cypress.config("defaultCommandTimeout", 3000)
describe("Udt test", () => {
  beforeEach("Prepare test", () => {
    cy.visit(`http://localhost:6001`)
    cy.setLanguage("en")
    cy.setTemplate("Empty")
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
  languageBoxTest()
})
