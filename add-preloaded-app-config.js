/*
Modify the index.html files to include the UDT_* environment variables. This
allows a default app_config to be loaded in the client application.
*/

const fs = require("fs")
const path = require("path")

const envObject = {}
for (const key of Object.keys(process.env)) {
  if (key.startsWith("UDT_")) {
    envObject[key.slice(4).replace(/_/g, ".")] = process.env[key]
  }
}

if (Object.keys(envObject).length > 0) {
  console.table(envObject)
}

const newIndexFileContent = fs
  .readFileSync(path.resolve(__dirname, "build", "index.html"))
  .toString()
  .replace(
    /window\.preloaded_app_config={.+?<\/script>/,
    `window.preloaded_app_config=${JSON.stringify(envObject)}</script>`
  )

fs.writeFileSync(
  path.resolve(__dirname, "build", "index.html"),
  newIndexFileContent
)
fs.writeFileSync(
  path.resolve(__dirname, "build/app", "index.html"),
  newIndexFileContent
)
