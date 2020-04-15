describe("Create a new file in the universal data tool", () => {
  it("should be able to create a new file", () => {
    cy.visit("http://localhost:6001")

    cy.contains("New File").click()
  })
  it("should be able to select all the interfaces", () => {
    cy.visit("http://localhost:6001")

    cy.contains("New File").click()

    cy.contains("Image Segmentation").click()
    cy.contains("Image Classification").click()
    cy.contains("Video Segmentation").click()
    cy.contains("Data Entry").click()
    cy.contains("Named Entity Recognition").click()
    cy.contains("Text Classification").click()
    cy.contains("Audio Transcription").click()
    cy.contains("Composite").click()
    cy.contains("3D Bounding Box").click()
  })
})
