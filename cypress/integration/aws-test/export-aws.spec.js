import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user.spec"
import setLanguage from "../../utils/set-language.spec"
import goToImportPage from "../../utils/go-to-import-page.spec"
import removeAWSFile from "../../utils/remove-cypress-file-in-aws.spec"
import "regenerator-runtime/runtime"
describe("aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.wait(400)

    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    goToImportPage()
  })

  it("Try to export a natif project to aws", () => {
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
    cy.contains("Create project").click()

    cy.log("should be able to see the new project")
    cy.wait(2000)
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-outlined WithStyles(ForwardRef(Button))-root-110']"
    )
      .eq(2)
      .click()
    cy.wait(200)
    cy.contains("CypressTest1")
    cy.contains("Close").click()
  })

  afterEach("Clean AWS", () => {
    removeAWSFile("CypressTest1")

    cy.log("should not be able to see the new project")
    cy.wait(200)
    cy.get(
      "button[class='MuiButtonBase-root MuiButton-root MuiButton-outlined WithStyles(ForwardRef(Button))-root-110']"
    )
      .eq(2)
      .click()
    cy.wait(200)
    cy.contains("CypressTest1").should("not.exist")
    cy.contains("Close").click()
  })
})
