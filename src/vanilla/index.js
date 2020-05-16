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
        dataset: udt,
        onSaveTaskOutputItem: (index, output) => {
          if (!props.onSaveSample) return
          props.onSaveSample(
            { ...udt.samples[index], annotation: output },
            index
          )
        },
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
