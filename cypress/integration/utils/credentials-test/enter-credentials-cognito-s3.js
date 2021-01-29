const enterCredentialsCognitoS3 = () => {
  var credentials = Cypress.env()
  cy.get('input[placeholder="XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab"]')
    .focus()
    .type(credentials.AWS_IDENTITY_POOL_ID)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .first()
    .focus()
    .type(credentials.AWS_AUTH_REGION)
  cy.get('input[placeholder="XX-XXXX-X_12ab34cd9"]')
    .focus()
    .type(credentials.AWS_USER_POOL_ID)
  cy.get('input[placeholder="26-char alphanumeric string"]')
    .focus()
    .type(credentials.AWS_USER_POOL_WEB_CLIENT_ID)
  cy.get('input[placeholder="Name of the bucket"]')
    .focus()
    .type(credentials.AWS_STORAGE_BUCKET)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .last()
    .focus()
    .type(credentials.AWS_STORAGE_REGION)
  cy.get('input[class="MuiInputBase-input MuiInput-input"]')
    .last()
    .focus()
    .type(credentials.COGNITO_USER_PASS_LENGTH)
  if (credentials.COGNITO_USER_PASS_REQUIRE_LOWERCASE == "TRUE") {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(0).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(1).click()
  }
  if (credentials.COGNITO_USER_PASS_REQUIRE_UPPERCASE == "TRUE") {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(2).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(3).click()
  }
  if (credentials.COGNITO_USER_PASS_REQUIRE_NUMBER == "TRUE") {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(4).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(5).click()
  }
  if (credentials.COGNITO_USER_PASS_REQUIRE_SYMBOL == "TRUE") {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(6).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-65"]').eq(7).click()
  }
}

const test = () => {
  cy.log("should be able to set s3 config")
  cy.contains("Add Authentification").click()
  cy.contains("AWS - Cognito").click()
  enterCredentialsCognitoS3()
  cy.contains("Complete").click()
}

export default test
