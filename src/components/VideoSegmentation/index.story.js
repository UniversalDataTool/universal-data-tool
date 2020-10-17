// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import VideoSegmentation from "./"

storiesOf("VideoSegmentation", module).add("Basic", () => (
  <VideoSegmentation
    onModifySample={action("onModifySample")}
    {...{
      interface: {
        type: "image_segmentation",
        description: "# Title\n\nLowercase",
        labels: ["valid", "invalid"],
        regionTypesAllowed: ["bounding-box", "polygon", "point"],
      },
      sample: {
        videoUrl:
          "https://s3.amazonaws.com/asset.workaround.online/SampleVideo_1280x720_1mb.mp4",
      },
    }}
  />
))
