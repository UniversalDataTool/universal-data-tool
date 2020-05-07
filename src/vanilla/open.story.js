// @flow

import React, { useEffect } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

storiesOf("Vanilla Open", module).add("Basic", () => {
  useEffect(() => {
    const script = document.createElement("script")
    script.onload = () => {
      window.UniversalDataTool.open({
        container: "udt",
        udt: {
          interface: {
            type: "image_segmentation",
          },
          samples: [
            {
              imageUrl:
                "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
            },
          ],
        },
        onSaveTaskOutputItem: (index, output) => {
          action("onSaveTaskOutputItem")(output)
        },
      })
    }
    script.type = "text/javascript"
    script.async = true
    script.src = "http://localhost:1234/index.js"
    window.document.body.appendChild(script)
  }, [])

  return (
    <div>
      you must be running the vanilla dev server for these examples to work
      <script src="http://localhost:1234/index.js"></script>
      <div id="udt"></div>
    </div>
  )
})
