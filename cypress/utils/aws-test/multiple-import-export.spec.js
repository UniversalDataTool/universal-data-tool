//This file include test who require multiple Import/Export
import importFromAnnotation from "../import-from-aws-annotations.spec"
import importFromAssets from "../import-from-aws-assets.spec"
import exportWithAsset from "../export-with-asset.spec"
const test = () => {
  //Check if load two times same sample if create two indentical samples
  it("Double import from Assets only (should prevent duplicas)", () => {
    importFromAssets("Image Classification", 2, 0)
    cy.contains("Import").click()
    importFromAssets("Image Classification", 2, 0)
  })

  it("Double import from Annotations only (should prevent duplicas)", () => {
    importFromAnnotation("Image Classification", 2, 0)
    cy.contains("Import").click()
    importFromAnnotation("Image Classification", 2, 0)
  })

  /* It don't use the same url so it fail
  it("Double import from Annotations then Assets only (should prevent duplicas)", () => {
    importFromAnnotation("Image Classification", 2, 0)
    cy.contains("Import").click()
    importFromAssets("Image Classification", 2, 0)
  })

  it("Double import from Assets then Annotations only (should prevent duplicas)", () => {
    importFromAssets("Image Classification", 2, 0)
    cy.contains("Import").click()
    importFromAnnotation("Image Classification", 2, 0)
  })*/
  //End of the concerning test of the comment above

  //Check if rename
  it.only("Rename test", () => {
    importFromAssets("Image Classification", 2, 0)
    cy.contains("Import").click()
    importFromAnnotation("Image Classification", 4, 0)
    cy.contains("Import").click()
    exportWithAsset("Rename Test", 0, "jpg")
    cy.log("Vérif rename")
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Rename Test")
    cy.get("button[data-testid='expander-button-" + 1 + "']").click()
    cy.contains("Load Assets").click()
    cy.contains("(1)")
  })
}
export default test
