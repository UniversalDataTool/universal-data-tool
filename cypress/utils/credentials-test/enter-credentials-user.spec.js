const enterCredentialsUser = () => {
  cy.get('input[id="username"]').focus().type(Cypress.env().COGNITO_USER_NAME)
  cy.get('input[id="password"]').focus().type(Cypress.env().COGNITO_USER_PASS)
}
const test = () => {
  cy.log("should be able to set user cognito config")
  cy.contains("Cognito").click()
  enterCredentialsUser()
  cy.get(
    'button[class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-submit-67 MuiButton-containedPrimary MuiButton-fullWidth"]'
  ).click()
  cy.wait(2000)
}
export default test
