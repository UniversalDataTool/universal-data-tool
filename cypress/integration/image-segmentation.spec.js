describe("Image Segmentation Tests", () => {
  it("should be able to create", () => {
    cy.visit("/")
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English", { force: true })
      .type("{enter}")
    cy.contains("New File").click()
  })

  it("should be able to import cat images dataset", () => {
    cy.get("#tab-samples").click()
    cy.contains("Import").click()
    cy.contains("Import Toy Dataset").click()
    cy.contains("Cats").siblings("td").eq(2).click()
  })

  it("should be able to setup image segmentation", () => {
    cy.get("#tab-setup").click()
    cy.contains("Image Segmentation").click()
    cy.contains("bounding-box").click()
    cy.get("li[data-value=polygon]").click()
    cy.get("li[data-value=point]").click()
    cy.get("body").click()
    cy.get("input[value=valid]").each(($el, index, $list) => {
      cy.get($el).focus().clear().type("cat")
    })
    cy.get("input[value=invalid]").each(($el, index, $list) => {
      cy.get($el).focus().clear()
    })
  })

  it("should be able to see samples", () => {
    cy.get("#tab-samples").click()
  })

  it("should be able start labeling images", () => {
    cy.get("div").contains("21").click()
    cy.get("div").contains("21").click()
  })

  it('should be able to select bounding box tool with "b" key', () => {
    cy.get("body").click().type("b")
  })

  it("should be able to draw a label box on canvas", () => {
    cy.get("canvas")
      .eq(0)
      .trigger("mousedown", { button: 0, clientX: 0, clientY: 50 })
      .trigger("mousemove", { button: 0, clientX: 0, clientY: 50 })
      .trigger("mousemove", { button: 0, clientX: 50, clientY: 50 })
      .trigger("mouseup", { button: 0 })
    cy.wait(50)
  })

  it("should be able to label that box as a cat", () => {
    cy.wait(200)
    cy.contains("Classification").click().type("cat{enter}")
    cy.wait(100)
  })

  it("should be able to go to next image", () => {
    cy.contains("Next").click()
  })
})
