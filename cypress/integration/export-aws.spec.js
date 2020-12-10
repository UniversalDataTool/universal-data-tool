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
    .type("English", { force: true })
    .type("{enter}")

    cy.log("should be able to set s3 config")
    cy.contains("Add Authentification").click()
    cy.get(
      'button[class="MuiButtonBase-root MuiButton-root MuiButton-text makeStyles-bigButton-10"]'
    )
      .first()
      .click()
    cy.fixture("credentials.json").then((credentials) =>
      enterCredentialsS3(credentials)
    )
    cy.get("div[class='sc-eHgmQL JxKOU']").children().click()

    cy.log("should be able to set user cognito config")
    cy.get(
      'button[class="MuiButtonBase-root MuiButton-root MuiButton-text makeStyles-headerButton-14"]'
    ).click()
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
    cy.get("span[class='MuiTouchRipple-root']")
      .eq(9)
      .trigger("mousedown", { force: true })
      .children()
      .click({ force: true })
    cy.get("span[class='MuiTouchRipple-root']")
      .eq(18)
      .trigger("mousedown", { force: true })
      .children()
      .click({ force: true })
    cy.get("span[class='MuiTouchRipple-root']")
      .eq(22)
      .trigger("mousedown", { force: true })
      .children()
      .click({ force: true })

    cy.log("should be able to use export project")
    cy.get("span[class='MuiTouchRipple-root']")
      .eq(28)
      .trigger("mousedown", { force: true })
      .children()
      .click({ force: true })
    cy.get("input[id='ProjectName']")
      .clear()
      .type("CypherTest1", { force: true })
      .type("{enter}")
    cy.get("button[class='MuiButtonBase-root MuiButton-root MuiButton-text']").last()
      .click()

    cy.log("should be able to see the new project")
    cy.wait(1000)
    cy.get("span[class='MuiTouchRipple-root']")
      .eq(28)
      .trigger("mousedown", { force: true })
      .children()
      .first()
      .trigger("mousedown", { force: true })
    cy.contains("CypherTest1")
  })
})
