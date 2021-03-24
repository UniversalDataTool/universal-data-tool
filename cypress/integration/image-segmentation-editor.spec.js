import commandSetLanguage from "./utils/cypress-command/set-language"
import leftSideBarTest from "./utils/image-segmentation-editor-test-part/LeftSideBar"
import topSideBarTest from "./utils/image-segmentation-editor-test-part/TopSideBar"
commandSetLanguage()
Cypress.config("defaultCommandTimeout", 3000)
describe("Udt test", () => {
  beforeEach("Go to editor", () => {
    cy.visit(`http://localhost:6001`)
    cy.setLanguage("en")
  })
  leftSideBarTest()
  topSideBarTest()
})
