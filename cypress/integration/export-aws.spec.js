const enterCredentialsS3 = (credentials) => {
  cy.get('input[placeholder="XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab"]')
    .focus()
    .type(credentials.CYPRESS_AWS_IDENTITY_POOL_ID)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .first()
    .focus()
    .type(credentials.CYPRESS_AWS_AUTH_REGION)
  cy.get('input[placeholder="XX-XXXX-X_12ab34cd9"]')
    .focus()
    .type(credentials.CYPRESS_AWS_USER_POOL_ID)
  cy.get('input[placeholder="26-char alphanumeric string"]')
    .focus()
    .type(credentials.CYPRESS_AWS_USER_POOL_WEB_CLIENT_ID)
  cy.get('input[placeholder="Name of the bucket"]')
    .focus()
    .type(credentials.CYPRESS_AWS_STORAGE_BUCKET)
  cy.get('input[placeholder="XX-XXXX-X"]')
    .last()
    .focus()
    .type(credentials.CYPRESS_AWS_STORAGE_REGION)
  cy.get('input[class="MuiInputBase-input MuiInput-input"]')
    .last()
    .focus()
    .type(credentials.CYPRESS_COGNITO_USER_PASS_LENGTH)
  if (credentials.CYPRESS_COGNITO_USER_PASS_REQUIRE_LOWERCASE) {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(0).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(1).click()
  }
  if (credentials.CYPRESS_COGNITO_USER_PASS_REQUIRE_UPPERCASE) {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(2).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(3).click()
  }
  if (credentials.CYPRESS_COGNITO_USER_PASS_REQUIRE_NUMBER) {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(4).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(5).click()
  }
  if (credentials.CYPRESS_COGNITO_USER_PASS_REQUIRE_SYMBOL) {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(6).click()
  } else {
    cy.get('input[class="PrivateSwitchBase-input-57"]').eq(7).click()
  }
}

const enterCredentialsCognito = (credentials) => {
  cy.get('input[id="username"]')
    .focus()
    .type(credentials.CYPRESS_COGNITO_USER_NAME)
  cy.get('input[id="password"]')
    .focus()
    .type(credentials.CYPRESS_COGNITO_USER_PASS)
}

describe("Try to export a natif project to aws", () => {
  it("", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)

    cy.log("should be able to set the language to english")
    cy.get('input[id="react-select-2-input"]')
      .focus()
      .type("English")
      .type("{enter}")

    cy.log("should be able to set s3 config")
    cy.contains("Add Authentification").click()
    cy.contains("AWS - Cognito").click()
    cy.fixture("credentials.json").then((credentials) =>
      enterCredentialsS3(credentials)
    )
    cy.contains("Complete").click()

    cy.log("should be able to set user cognito config")
    cy.contains("Cognito").click()
    cy.fixture("credentials.json").then((credentials) =>
      enterCredentialsCognito(credentials)
    )
    cy.get(
      'button[class="MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-submit-62 MuiButton-containedPrimary MuiButton-fullWidth"]'
    ).click()
    cy.wait(2000)

    cy.log("should be able to go to the import page")
    cy.get(
      "button[class='MuiButtonBase-root MuiIconButton-root makeStyles-headerButton-14']"
    ).click()
    cy.wait(200)
    cy.contains("Image Segmentation").click({ force: true })
    cy.wait(200)
    cy.contains("Samples").click()
    cy.wait(200)
    cy.contains("Import").click()

    cy.log("should be able to use export project")
    cy.wait(200)
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-outlined WithStyles(ForwardRef(Button))-root-110']"
    )
      .eq(2)
      .click()
    cy.get("input[id='ProjectName']")
      .clear()
      .type("CypressTest1")
      .type("{enter}")
    cy.get("button[class='MuiButtonBase-root MuiButton-root MuiButton-text']")
      .last()
      .click()

    cy.log("should be able to see the new project")
    cy.wait(4000)
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-outlined WithStyles(ForwardRef(Button))-root-110']"
    )
      .eq(2)
      .click()
    cy.contains("CypressTest1")
  })
})
