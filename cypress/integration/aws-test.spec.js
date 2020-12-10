import enterCredentialsCognitoS3 from "../utils/credentials-test/enter-credentials-cognito-s3"
import enterCredentialsUser from "../utils/credentials-test/enter-credentials-user"
import setLanguage from "../utils/set-language"
import goToImportPage from "../utils/go-to-import-page"

describe("aws test", () => {
  it("Try to export a natif project to aws", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)

    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    goToImportPage()

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
