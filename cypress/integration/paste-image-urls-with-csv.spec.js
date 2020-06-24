const csvHeader = "customId,imageUrl,male_or_female.value"
const csvRows = [
    "faces/010260.jpg,https://wao.ai/app/api/download/0031a48c-635a-4ea9-833f-9381c88836d2,female",
    "faces/010265.jpg,https://wao.ai/app/api/download/00409ca5-1e28-43c6-9f10-6cccf47178a3,female",
    "faces/011094.jpg,https://wao.ai/app/api/download/0060b2fa-6f7d-49c3-a965-ab82fe8a9475,female"
]

describe("Create a new", () => {
    it('should be able to create', () => {
        cy.visit("/")
        cy.contains("New File").click()
    })

    it('should be able to open paste', () => {
        cy.contains("Samples").click()
        cy.contains("Import from CSV / JSON").click()
        // cy.contains("Import Text Snippets").click()
    })

    it('should be able to click textarea to paste', () =>{
        cy.get("textarea").click()
    })

    it('should be able to paste image urls', () => {
        cy.get("textarea")
            .type(csvHeader)
            .type("{enter}")
        for(const csvRow of csvRows){
            cy.get("textarea")
                .type(csvRow + "{enter}")
        }
    })

    it('should be able to add that samples', () => {
        cy.contains("Add Samples").click()
    })

    it('should be able to go to setup', () => {
        cy.contains("Setup").click()
    })

    it('should be able to go to Image Classification', () => {
        cy.contains("Image Classification").click()
    })

    it('should be able to see samples', () => {
        cy.contains("Samples").click()
        cy.contains("2").click()
    })

    it('should be able to label image', () => {
        cy.wait(200)
        cy.get("body").click().type("{enter}")
        cy.wait(200)
        cy.get("body").click().type("{enter}")
    })
})