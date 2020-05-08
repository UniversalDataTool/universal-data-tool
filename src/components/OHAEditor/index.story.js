// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import OHAEditor from "./"

const Controller = (props) => {
  const [oha, changeOHA] = useState(props.initialOHA)
  return (
    <OHAEditor
      oha={oha}
      onChangeOHA={(...props) => {
        changeOHA(...props)
        action("onChangeOHA")(...props)
      }}
      {...props}
    />
  )
}

storiesOf("OHAEditor", module).add("Basic", () => (
  <Controller
    initialOHA={{
      interface: {
        type: "image_segmentation",
        availableLabels: ["valid", "invalid"],
        regionTypesAllowed: ["bounding-box", "polygon", "point"],
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
      taskOutput: [
        {
          regionType: "bounding-box",
          centerX: 0.5,
          centerY: 0.5,
          width: 0.25,
          height: 0.25,
        },
      ],
    }}
    onChangeFileName={action("onChangeFileName")}
  />
))
