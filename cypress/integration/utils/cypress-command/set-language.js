const command = (langChar) => {
  //Possible input en,fr,cn.dl and pt
  Cypress.Commands.add("setLanguage", () => {
    localStorage.setItem("i18nextLng", langChar)
    cy.reload()
  })
}
export default command
