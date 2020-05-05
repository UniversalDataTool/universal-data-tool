// @flow

import React, { useEffect } from "react"

import useVanilla from "./use-vanilla"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

storiesOf("Vanilla Image Classification", module).add("Layout 1", () => {
  useVanilla("udt", {
    interface: {
      type: "image_classification",
      labels: ["A", "B"],
    },
    samples: [
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
      },
    ],
  })

  return (
    <div>
      you must be running the vanilla dev server for these examples to work
      <script src="http://localhost:1234/index.js"></script>
      <div id="udt"></div>
    </div>
  )
})
