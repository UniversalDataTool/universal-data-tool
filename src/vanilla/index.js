// UniversalDataTool without React bundle

import React from "react"
import ReactDOM from "react-dom"
import Theme from "../components/Theme"
import UniversalSampleEditor from "../components/UniversalSampleEditor"

const open = ({ container, udt, ...props }) => {
  ReactDOM.render(
    React.createElement(
      Theme,
      null,
      React.createElement(UniversalSampleEditor, {
        ...props,
        dataset: udt,
        onModifySample: (index, output) => {
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
