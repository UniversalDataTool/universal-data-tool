/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// https://github.com/palmerhq/cypress-image-snapshot
const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin")

module.exports = (on, config) => {
  const options = {
    outputRoot: config.projectRoot + "/logs/",
    outputTarget: {
      "out.txt": "txt",
      "out.json": "json",
    },
    printLogsToConsole: "never",
  }
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  addMatchImageSnapshotPlugin(on, config),
    require("@cypress/react/plugins/react-scripts")(on, config)
  require("cypress-terminal-report/src/installLogsPrinter")(on, options)
  return config
}
