import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage =
    "It looks like you have been editing something. " +
    "If you leave before saving, your changes will be lost."

  ;(e || window.event).returnValue = confirmationMessage //Gecko + IE
  return confirmationMessage //Gecko + Webkit, Safari, Chrome etc.
})

ReactDOM.render(<App />, document.getElementById("root"))
