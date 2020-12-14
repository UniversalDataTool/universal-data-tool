import setLanguage from "../utils/set-language.spec"
const imageUrls = [
  "https://wao.ai/app/api/download/fef3ee4d-f841-42f5-ba22-a7c8eb214628",
  "https://wao.ai/app/api/download/f80f660f-6641-4241-9c9d-7c3ac26c5a17",
  "https://wao.ai/app/api/download/ff03593a-6b7e-46dd-91bf-9e741c35c227",
]

describe("Paste Image URLs", () => {
  it("should be able to create", () => {
    cy.visit("/")
    setLanguage()
    cy.contains("New File").click()
  })

  it("should be able to open paste", () => {
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Paste URLs").click()
  })

  it("should be able to paste image urls", () => {
    const imagesWithNewLines = imageUrls.join("{enter}")
    cy.get("textarea").type(imagesWithNewLines)
  })

  it("should be able to add that samples", () => {
    cy.contains("Auto Detect File Type").click({ force: true })
    cy.contains("Image URLs").click({ force: true })
    cy.contains("Add Samples").click()
  })

  it("should be able to go to setup", () => {
    cy.get("#tab-setup").click()
  })

  it("should be able to go to Image Classification", () => {
    cy.contains("Image Classification").click()
  })

  it("should be able to see samples", () => {
    cy.get("#tab-samples").click()
    cy.contains("2").click()
  })
  it("should be able to label image", () => {
    cy.wait(200)
    cy.get("body").click().type("{enter}")
    cy.wait(200)
    cy.get("body").click().type("{enter}")
  })
})
