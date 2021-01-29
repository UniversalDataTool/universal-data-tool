import React from "react"
const WarningHeader = ({ configImport, projectToFetch }) => {
  const orangeText = { color: "orange" }
  var text = ``
  if (!configImport.isReady) text += `Warning :`
  else return <p style={orangeText}>{text}</p>
  if (!projectToFetch || projectToFetch === "")
    text += ` You need to select a project.\n`
  if (
    configImport.loadAssetsIsSelected &&
    (configImport.typeOfFileToLoad === "None" ||
      configImport.typeOfFileToLoad === undefined)
  )
    text += ` You need to select a type of file to load.\n`

  return (
    <div style={orangeText}>
      {text.split("\n").map((obj, i) => {
        return <div key={i}>{obj}</div>
      })}
    </div>
  )
}
export default WarningHeader
