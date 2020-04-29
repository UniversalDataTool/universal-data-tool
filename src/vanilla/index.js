// UniversalDataTool without React bundle

import React from "react"
import ReactDOM from "react-dom"
import Theme from "../components/Theme"
import UniversalDataViewer from "../components/UniversalDataViewer"

const open = ({ container, udt, ...props }) => {
  ReactDOM.render(
    React.createElement(
      Theme,
      null,
      React.createElement(UniversalDataViewer, {
        ...props,
        oha: udt,
      })
    ),
    typeof container === "string"
      ? document.getElementById(container)
      : container
  )
}

window.UniversalDataTool = {
  open,
  UniversalDataViewer: open,
}
