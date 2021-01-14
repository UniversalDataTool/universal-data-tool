const csvHeader = "customId,imageUrl,male_or_female.value"
const csvRows = [
  "faces/010260.jpg,https://wao.ai/app/api/download/0031a48c-635a-4ea9-833f-9381c88836d2,female",
  "faces/010265.jpg,https://wao.ai/app/api/download/00409ca5-1e28-43c6-9f10-6cccf47178a3,female",
  "faces/011094.jpg,https://wao.ai/app/api/download/0060b2fa-6f7d-49c3-a965-ab82fe8a9475,female",
]

const pasteImageUrlsWithCSV = () => {
  it("Should be able to paste images urls with CSV", () => {
    cy.contains("New File").click()

    cy.log("should be able to open import dialog")
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import from CSV / JSON").click()

    cy.log("should be able to click textarea to paste")
    cy.get("textarea").click()

    cy.log("should be able to paste csv of image urls")
    cy.get("textarea").type(csvHeader).type("{enter}")
    for (const csvRow of csvRows) {
      cy.get("textarea").type(csvRow + "{enter}")
    }

    cy.log("should be able to add samples from csv")
    cy.contains("Add Samples").click()

    cy.log("should be able to go to setup")
    cy.get("#tab-setup").click()

    cy.log("should be able to go to Image Classification setup")
    cy.contains("Image Classification").click()

    cy.log("should be able to see samples")
    cy.get("#tab-samples").click()
    cy.contains("2").click()

    cy.log("should be able to label image")
    cy.get("body").click().type("{enter}")
    cy.get("body").click().type("{enter}")
  })
}

export default pasteImageUrlsWithCSV
