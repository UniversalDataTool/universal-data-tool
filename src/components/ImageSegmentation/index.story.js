// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageSegmentation from "./"

storiesOf("ImageSegmentation", module).add("Basic", () => (
  <ImageSegmentation
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    {...{
      interface: {
        type: "image_segmentation",
        description: "# Title\n\nLowercase",
        labels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          "full-segmentation",
          "point",
          "pixel-mask",
        ],
      },
      samples: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
          annotation: {
            regionType: "bounding-box",
            centerX: 0.5,
            centerY: 0.5,
            width: 0.25,
            height: 0.25,
          },
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
      ],
    }}
  />
))
