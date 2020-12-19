/*

The react library needs special preparation because the dependencies in package.json
represent the dependencies of the web application and the desktop application,
which includes a lot of junk if you're only using this as a react package.

For example, you don't need a video conversion library (ffmpeg) if you're importing
a react component.

This script replaces the package.json dependencies list with only whitelisted
dependencies.

In the future, we might want to add optional peer dependencies, because if you're
using configuration GUIs in the react app you might want a couple extra deps.

*/

const fs = require("fs")
const path = require("path")

const deps = [
  "react-image-annotate",
  "@material-ui/core",
  "@material-ui/styles",
  "@material-ui/icons",
  "moment",
  "react-dropzone",
  "react-icons",
  "react-select",
  "seamless-immutable",
  "styled-components",
  "use-event-callback",
  "material-survey",
  "react-markdown",
  "react-nlp-annotate",
  "spelling",
  "i18next",
  "react-i18next",
  "i18next-browser-languagedetector",
  "react-time-series",
]

const originalPackageJSON = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json")).toString()
)

const newDependencies = {}
for (const dep of deps) {
  newDependencies[dep] =
    originalPackageJSON.dependencies[dep] ||
    originalPackageJSON.devDependencies[dep]
}

fs.writeFileSync(
  path.join(__dirname, "../package.json"),
  JSON.stringify(
    Object.assign({}, originalPackageJSON, {
      devDependencies: Object.assign(
        {},
        originalPackageJSON.devDependencies,
        originalPackageJSON.dependencies
      ),
      dependencies: newDependencies,
      main: "components/UniversalSampleEditor/index.js",
    }),
    null,
    "  "
  )
)
