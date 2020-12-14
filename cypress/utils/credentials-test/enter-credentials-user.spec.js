const enterCredentialsUser = (credentials) => {
  cy.get('input[id="username"]')
    .focus()
    .type(credentials.CYPRESS_COGNITO_USER_NAME)
  cy.get('input[id="password"]')
    .focus()
    .type(credentials.CYPRESS_COGNITO_USER_PASS)
}
const test = () => {
  cy.log("should be able to set user cognito config")
  cy.contains("Cognito").click()
  cy.fixture("credentials.json").then((credentials) =>
    enterCredentialsUser(credentials)
  )
  cy.get(
    'button[class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-submit-67 MuiButton-containedPrimary MuiButton-fullWidth"]'
  ).click()
  cy.wait(2000)
}
export default test
