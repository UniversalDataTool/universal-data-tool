const times = (howManyTimes) => (functionWillExecute) => {
    if (howManyTimes > 0) {
        functionWillExecute()
        times(howManyTimes - 1)(functionWillExecute)
    }
}

describe("Create a new", () => {
    it("should be able to create", () => {
        cy.visit("http://localhost:6001")

        cy.contains("New File").click()
    })

    it("should be able to import Elon Musk Tweets images dataset", () => {
        cy.contains("Samples").click()
        cy.contains("Import Toy Dataset").click()
        cy.contains("Elon Musk Tweets").siblings("td").eq(2).click()
    })

    it("should be able to setup Named Entity Recognition", () => {
        cy.contains("Setup").click()
        cy.contains("Named Entity Recognition").click()
        cy.get("input[value=food]").focus().clear().type("mars")
        cy.get("input[value=Food]").focus().clear().type("About Mars")
        cy.get("input[value='Edible item.']").focus().clear().type("what is Elon Musk obsessed with.")
        cy.get("input[value=hat]").focus().clear().type("not_mars")
        cy.get("input[value=Hat]").focus().clear().type("Not about Mars")
        cy.get("input[value='Something worn on the head.']").focus().clear().type("not about Elon Musk's obsession")
    })

    it("should be able to see samples", () => {
        cy.contains("Samples").click()
    })

    it("should be able start labeling images from 21st sample", () => {
        cy.contains("div", "21").click()
    })

    it('should be able to label samples', () => {
        times(4)(() => {
            cy.get("body").click().type("n")
            cy.get("body").click().type("{enter}")
        })
    })

    it("should be able to return samples tab", () => {
        cy.contains("Samples").click()
        cy.wait(30)
    })

    it("should be able to show label tab", () => {
        cy.contains("Label").click()
    })
})