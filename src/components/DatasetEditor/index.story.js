// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DatasetEditor from "./"

const Controller = (props) => {
  const [dataset, changeOHA] = useState(props.initialOHA)
  return (
    <DatasetEditor
      dataset={dataset}
      onChangeDataset={(...props) => {
        changeOHA(...props)
        action("onChangeDataset")(...props)
      }}
      {...props}
    />
  )
}

storiesOf("DatasetEditor", module).add("Basic", () => (
  <Controller
    initialOHA={{
      interface: {
        type: "image_segmentation",
        labels: ["valid", "invalid"],
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
