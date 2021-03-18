import React from "react"
const WarningHeader = ({ nameProjectExist, nameProjectToCreate }) => {
  const orangeText = { color: "orange", textAlign: "center" }
  var text = `Warning :`
  if (nameProjectExist)
    text += ` This project name already exist. If you continue the existing project with the same name will be replaced.\n`
  if (nameProjectToCreate === "") text += ` Please enter a project name.\n`
  return text === `Warning :` ? (
    <div></div>
  ) : (
    <div style={orangeText}>
      {text.split("\n").map((obj, i) => {
        return <div key={i}>{obj}</div>
      })}
    </div>
  )
}
export default WarningHeader
