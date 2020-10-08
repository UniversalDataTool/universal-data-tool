// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageClassification from "./"

storiesOf("ImageClassification", module)
  .add("Basic", () => (
    <ImageClassification
      onModifySample={action("onModifySample")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
        },
        sample: {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
          annotation: "valid",
        },
      }}
    />
  ))
  .add("Allow Multiple", () => (
    <ImageClassification
      onModifySample={action("onModifySample")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          allowMultiple: true,
        },
        sample: {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
          annotation: "valid",
        },
      }}
    />
  ))
