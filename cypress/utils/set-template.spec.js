const setDatasetCypress = (template) => {
  cy.log("Set template")
  cy.then({ timeout: 100000 }, () => {
    cy.then(() => {
      var appConfig = localStorage.getItem("app_config")
      appConfig = JSON.parse(appConfig)
      appConfig.defaultTemplate = template
      localStorage.setItem("app_config", JSON.stringify(appConfig))
    })
  })
}
export default setDatasetCypress
