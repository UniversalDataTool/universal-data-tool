const test = () => {
  cy.log("should be able to set the language to english")
  cy.wait(400)
  cy.get('input[id="react-select-2-input"]')
    .focus()
    .type("English")
    .type("{enter}")
}
export default test
