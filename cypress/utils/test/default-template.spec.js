import commandSetTemplate from "../cypress-command/set-template.spec"
const defaultTemplate = () => {
  commandSetTemplate()
  it("Should be able to set a default template", () => {
    cy.setTemplate("Image Segmentation")
    cy.contains("New File").click()
    cy.get(
      "button[class='MuiButtonBase-root MuiTab-root MuiTab-textColorInherit MuiTab-labelIcon']",
      { timeout: 2000 }
    )
      .eq(2)
      .click()
    cy.contains("image_segmentation")
  })
}
export default defaultTemplate
