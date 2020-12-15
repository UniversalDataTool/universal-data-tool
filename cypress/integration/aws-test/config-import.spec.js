import enterCredentialsCognitoS3 from "../../utils/credentials-test/enter-credentials-cognito-s3.spec"
import enterCredentialsUser from "../../utils/credentials-test/enter-credentials-user.spec"
import setLanguage from "../../utils/set-language.spec"
import goToImportPage from "../../utils/go-to-import-page.spec"
import "regenerator-runtime/runtime"
describe("Import config aws test", () => {
  before("Prepare tests", () => {
    cy.log("should be able to join the web site")
    cy.visit(`http://localhost:6001`)
    cy.wait(400)

    setLanguage()
    enterCredentialsCognitoS3()
    enterCredentialsUser()
    goToImportPage()
  })

  it("Check behavior Load Assets/Annotations", () => {
    cy.log("check initial config")
    cy.wait(200)
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Load Assets").should("be.disabled")
    cy.contains("Load Annotations").should("not.be.disabled")

    cy.log("Check if type of import is kept")
    cy.contains("Load Annotations").click()
    cy.contains("Close").click()
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Load Assets").should("not.be.disabled")
    cy.contains("Load Annotations").should("be.disabled")

    cy.log("return to initial state")
    cy.contains("Load Assets").click()
    cy.contains("Close").click()
  })

  it("Check behavior setting/storage panel", () => {
    cy.log("Check if open on Storage panel")
    cy.wait(200)
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Annotation processing").should("not.exist")
    cy.contains("Choose file type").should("not.exist")

    cy.log("Check if able to change panel")
    cy.get("svg[id='SettingIcon']").click()
    cy.contains("Choose file type")
    cy.contains("Close").click()

    cy.log("check if stay in setting panel when closed")
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Choose file type")

    cy.log("Check if change setting for type of import")
    cy.contains("Load Annotations").click()
    cy.contains("Annotation processing")

    cy.log("return to initial state")
    cy.contains("Load Assets").click()
    cy.get("svg[id='StorageIcon']").click()
    cy.contains("Close").click()
  })
  it("Check if disable non compatible type of file", () => {
    cy.log("TODO")
  })
  it("Check if disable import when project not selected", () => {
    cy.contains("Import from S3 (Cognito)").click()
    cy.contains("Take samples from project").should("be.disabled")
    cy.get("input[name='select-row-0']").click()
    cy.contains("Take samples from project").should("not.be.disabled")
  })
})
