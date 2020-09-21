let collobrationURL

describe("Create a new file in the universal data tool", () => {
    it('should be able to create new file', () => {
      cy.visit("http://localhost:6001")

      cy.contains("New File").click()
    })
    
    it('should be able to import Elon Musk Tweets images dataset', () => {
      cy.contains("Samples").click()
      cy.contains("Import Toy Dataset").click()
      cy.contains("Elon Musk Tweets").siblings("td").eq(2).click()
    })

    it('should be able to create new session', () => {
        cy.get("div[title='collaborate-icon']").click()
        cy.contains("Create New Session").click()
    });
    
    it('should be able to store session url', () =>{
        cy.get("div[title='share-link']", {timeout: 20000}).children().children().then(elements => {
            collobrationURL = Cypress.$(elements[0]).val()
        })
    })

    it('should be able to go for session url', () =>{
        cy.visit(collobrationURL)
    })

    it('should be able to navigate to samples', () =>{
        cy.contains("Samples").click()
    })
})