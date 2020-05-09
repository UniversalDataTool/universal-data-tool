// @flow weak

import { useEffectOnce } from "react-use"
import { action } from "@storybook/addon-actions"

export default (elm, udt) => {
  useEffectOnce(() => {
    const script = document.createElement("script")
    script.onload = () => {
      window.UniversalDataTool.open({
        container: elm,
        udt,
        onSaveTaskOutputItem: (index, output) => {
          action("onSaveTaskOutputItem")(output)
        },
      })
    }
    script.type = "text/javascript"
    script.async = true
    script.src = "http://localhost:1234/index.js"
    window.document.body.appendChild(script)
  })
}
