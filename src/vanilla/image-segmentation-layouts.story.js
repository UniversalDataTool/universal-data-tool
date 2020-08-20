// @flow

import React from "react"

import useVanilla from "./use-vanilla"
import { storiesOf } from "@storybook/react"

const useVanillaImageSegmentation = () => {
  useVanilla("udt", {
    interface: {
      type: "image_segmentation",
      labels: ["A", "B"],
    },
    samples: [
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
      },
    ],
  })
}

storiesOf("Vanilla Image Segmentation", module)
  .add("Layout 1", () => {
    useVanillaImageSegmentation()
    return (
      <div>
        you must be running the vanilla dev server for these examples to work
        <script src="http://localhost:1234/index.js"></script>
        <div id="udt"></div>
      </div>
    )
  })
  .add("Layout 2", () => {
    useVanillaImageSegmentation()
    return (
      <div>
        you must be running the vanilla dev server for these examples to work
        <script src="http://localhost:1234/index.js"></script>
        <div style={{ padding: 200, backgroundColor: "#000" }}>
          <div style={{ backgroundColor: "#fff" }}>
            <div id="udt"></div>
          </div>
        </div>
      </div>
    )
  })
  .add("Layout 3", () => {
    useVanillaImageSegmentation()
    return (
      <div>
        you must be running the vanilla dev server for these examples to work
        <script src="http://localhost:1234/index.js"></script>
        <div style={{ padding: 200, backgroundColor: "#000" }}>
          <div style={{ height: 1000, backgroundColor: "#fff" }} id="udt"></div>
        </div>
      </div>
    )
  })
