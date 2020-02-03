// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import OHAEditor from "./"

const Controller = props => {
  const [oha, changeOHA] = useState(props.initialOHA)
  return <OHAEditor oha={oha} onChangeOHA={changeOHA} {...props} />
}

storiesOf("OHAEditor", module).add("Basic", () => (
  <Controller
    initialOHA={{
      interface: {
        type: "image_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: [
          "bounding-box",
          "polygon",
          "full-segmentation",
          "point",
          "pixel-mask"
        ]
      },
      taskData: [
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
        }
      ]
    }}
    onChangeFileName={action("onChangeFileName")}
    onChangeOHA={action("onChangeOHA")}
  />
))
