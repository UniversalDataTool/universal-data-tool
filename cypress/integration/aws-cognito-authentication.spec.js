const awsCredentials = [
    "identity_pool_id",
    "region",
    "user_pool_id",
    "user_pool_web_client_id",
    "awss3_bucket",
    "awss3_region"
]

describe("AWS Cognito authentication", () => {
    it("should be able to open application", () => {
        cy.visit("http://localhost:6001")
    })

    it("should be able to open 'Add Authentification for AWS - Cognito' modal", () => {
        cy.contains("Add Authentification").click()
    })

    it("should be able to open 'AWS - Cognito' modal", () => {
        cy.contains("AWS - Cognito").click()
    })

    it("should be able to fill AWS Cognito credentials", () => {
        cy.get("input[type=text]").each(($el, index, $list) => {
            if (index > 0) {
                const credentialKey = `AWS_COGNITO_${awsCredentials[index - 1]}`
                const upperCaseCredentialKey = credentialKey.toUpperCase()
                const credential = Cypress.env(upperCaseCredentialKey)//[`${upperCaseCredentialKey}`]
                cy.get($el).type(credential)
            }
        })
    })

    it("should be able to press 'Complete' button", () => {
        cy.contains("Complete").click()
    })

    it("should be able to open 'Login with Cognito' drawer", () => {
        cy.contains("Login with Cognito").click()
    })

    it("should be able login to 'Cognito'", () => {
        const username = Cypress.env("CYPRESS_AWS_COGNITO_USERNAME")
        cy.get("input[id=username]").type(username)
        const password = Cypress.env("CYPRESS_AWS_COGNITO_PASSWORD")
        cy.get("input[id=password]").type(password)
        cy.contains("Sign In").click()
    })

    it("should be able to see 'Logout'", () => {
        cy.contains("Logout")
    })
})