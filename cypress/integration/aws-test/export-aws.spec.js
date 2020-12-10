import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user"
import setLanguage from "../../utils/set-language"

describe("Try to export a natif project to aws", () => {
  it("", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)

    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()

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
