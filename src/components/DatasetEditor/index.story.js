// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { HotKeys } from "react-hotkeys"

import DatasetEditor from "./"
import EditableTitleText from "./EditableTitleText"

const Controller = (props) => {
  const [dataset, changeDataset] = useState(props.initialDataset)
  return (
    <DatasetEditor
      dataset={dataset}
      onChangeDataset={(...props) => {
        changeDataset(...props)
        action("onChangeDataset")(...props)
      }}
      {...props}
    />
  )
}

storiesOf("DatasetEditor", module)
  .add("Basic", () => (
    <Controller
      initialDataset={{
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
  .add("Basic with Hotkeys", () => (
    <HotKeys
      keyMap={{
        zoom_tool: "z",
        pan_tool: "p",
      }}
    >
      <Controller
        initialDataset={{
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
    </HotKeys>
  ))

storiesOf("EditableTitleText", module).add("Basic", () => {
  const [valueDisplay, setValueDisplay] = useState("unnamed")
  return (
    <>
      <div style={{ margin: "8px 8px 16px 8px" }}>
        parent component value: <strong>{valueDisplay}</strong>
      </div>
      <EditableTitleText
        label="File Name"
        onChange={(newName) => {
          setValueDisplay(newName)
        }}
        value={valueDisplay || ""}
      />
    </>
  )
})
