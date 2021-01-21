const enterCredentialsCognitoS3 = () => {
  cy.get('input[placeholder="XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab"]')
    .focus()
    .type(Cypress.env().AWS_IDENTITY_POOL_ID)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .first()
    .focus()
    .type(Cypress.env().AWS_AUTH_REGION)
  cy.get('input[placeholder="XX-XXXX-X_12ab34cd9"]')
    .focus()
    .type(Cypress.env().AWS_USER_POOL_ID)
  cy.get('input[placeholder="26-char alphanumeric string"]')
    .focus()
    .type(Cypress.env().AWS_USER_POOL_WEB_CLIENT_ID)
  cy.get('input[placeholder="Name of the bucket"]')
    .focus()
    .type(Cypress.env().AWS_STORAGE_BUCKET)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .last()
    .focus()
    .type(Cypress.env().AWS_STORAGE_REGION)
  cy.get('input[class="MuiInputBase-input MuiInput-input"]')
    .last()
    .focus()
    .type(Cypress.env().COGNITO_USER_PASS_LENGTH)
  if (Cypress.env().COGNITO_USER_PASS_REQUIRE_LOWERCASE === "TRUE") {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(0)
      .click()
      .focus()
      .blur()
  } else {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(1)
      .click()
      .focus()
      .blur()
  }
  if (Cypress.env().COGNITO_USER_PASS_REQUIRE_UPPERCASE === "TRUE") {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(2)
      .click()
      .focus()
      .blur()
  } else {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(3)
      .click()
      .focus()
      .blur()
  }
  if (Cypress.env().COGNITO_USER_PASS_REQUIRE_NUMBER === "TRUE") {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(4)
      .click()
      .focus()
      .blur()
  } else {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(5)
      .click()
      .focus()
      .blur()
  }
  if (Cypress.env().COGNITO_USER_PASS_REQUIRE_SYMBOL === "TRUE") {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(6)
      .click()
      .focus()
      .blur()
  } else {
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-text sc-fodVxV iltTAv']"
    )
      .eq(7)
      .click()
      .focus()
      .blur()
  }
}

const test = () => {
  it("Enter credentials cognito-s3", () => {
    cy.log("should be able to set s3 config")
    cy.contains("Add Authentification").click()
    cy.contains("AWS - Cognito").click()
    enterCredentialsCognitoS3()
    cy.contains("Complete").click()
  })
}

export default test