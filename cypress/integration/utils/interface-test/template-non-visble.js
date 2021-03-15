const templateNonVisible = () => {
  it("time series 2 should not be visible", () => {
    cy.contains("New File").click()
    cy.contains("Time Series 2").should("not.exist")
  })
}

export default templateNonVisible
