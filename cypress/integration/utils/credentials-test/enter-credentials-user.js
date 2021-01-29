const enterCredentialsUser = () => {
  var credentials = Cypress.env()
  cy.get('input[id="username"]').focus().type(credentials.COGNITO_USER_NAME)
  cy.get('input[id="password"]').focus().type(credentials.COGNITO_USER_PASS)
}
const test = () => {
  cy.log("should be able to set user cognito config")
  cy.contains("Cognito").click()
  enterCredentialsUser()
  cy.get(
    'button[class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-submit-70 MuiButton-containedPrimary MuiButton-fullWidth"]'
  ).click()
}
export default test
