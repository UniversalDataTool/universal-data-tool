//This file include test who require multiple Import/Export
import importFromAnnotation from "../import-from-aws-annotations.spec"
import importFromAssets from "../import-from-aws-assets.spec"

const test = () => {
  //Check if load two times same sample if create two indentical samples
  it("Double import from Assets only (should prevent duplicas)", () => {
    importFromAssets("Image Classification", "Image Classification", 2, 0)
    cy.get("button[title='Exit to Welcome Page']").click()
    importFromAssets("Image Classification", "Image Classification", 2, 0)
  })

  it("Double import from Annotations only (should prevent duplicas)", () => {
    importFromAnnotation("Image Classification", "Image Classification", 2, 0)
    cy.get("button[title='Exit to Welcome Page']").click()
    importFromAnnotation("Image Classification", "Image Classification", 2, 0)
  })

  it("Double import from Annotations then Assets only (should prevent duplicas)", () => {
    importFromAnnotation("Image Classification", "Image Classification", 2, 0)
    cy.get("button[title='Exit to Welcome Page']").click()
    importFromAssets("Image Classification", "Image Classification", 2, 0)
  })

  it("Double import from Assets then Annotations only (should prevent duplicas)", () => {
    importFromAssets("Image Classification", "Image Classification", 2, 0)
    cy.get("button[title='Exit to Welcome Page']").click()
    importFromAnnotation("Image Classification", "Image Classification", 2, 0)
  })
  //End of the concerning test of the comment above
}
export default test
