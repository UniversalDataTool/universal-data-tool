// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageClassification from "./"

storiesOf("ImageClassification", module)
  .add("Basic", () => (
    <ImageClassification
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
        },
        samples: [
          {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
            annotation: "valid",
          },
          {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
          },
        ],
      }}
    />
  ))
  .add("Allow Multiple", () => (
    <ImageClassification
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          allowMultiple: true,
        },
        samples: [
          {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
            annotation: "valid",
          },
          {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
          },
        ],
      }}
    />
  ))
