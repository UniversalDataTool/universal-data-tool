const command = () => {
  Cypress.Commands.add("setTemplate", (template) => {
    cy.log("Set template")
    var appConfig = localStorage.getItem("app_config")
    appConfig = JSON.parse(appConfig)
    appConfig.defaultTemplate = template
    localStorage.setItem("app_config", JSON.stringify(appConfig))
  })
}
export default command
