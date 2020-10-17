// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { HotKeys } from "react-hotkeys"

import ImageSegmentation from "./"

storiesOf("ImageSegmentation", module)
  .add("Basic", () => (
    <ImageSegmentation
      onModifySample={action("onModifySample")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          regionTypesAllowed: ["bounding-box", "polygon", "point"],
        },
        sample: {
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
      }}
    />
  ))
  .add("with hot keys", () => (
    <HotKeys
      keyMap={{
        zoom_tool: "z",
        pan_tool: "p",
      }}
    >
      <ImageSegmentation
        onModifySample={action("onModifySample")}
        {...{
          interface: {
            type: "image_segmentation",
            description: "# Title\n\nLowercase",
            labels: ["valid", "invalid"],
            regionTypesAllowed: ["bounding-box", "polygon", "point"],
          },
          sample: {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
            annotation: {
              regionType: "bounding-box",
              centerX: 0.5,
              centerY: 0.5,
              width: 0.25,
              height: 0.25,
            },
            allowedArea: {
              x: 0.5,
              y: 0.5,
              width: 0.5,
              height: 0.5,
            },
          },
        }}
      />
    </HotKeys>
  ))
  .add("full image segmentation", () => (
    <ImageSegmentation
      onModifySample={action("onModifySample")}
      {...{
        interface: {
          type: "image_pixel_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          regionTypesAllowed: ["bounding-box", "polygon", "point"],
        },
        sample: {
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
      }}
    />
  ))
