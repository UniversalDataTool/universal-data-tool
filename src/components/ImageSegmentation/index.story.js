// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { HotKeys } from "react-hotkeys"

import ImageSegmentation from "./"

storiesOf("ImageSegmentation", module)
  .add("Basic", () => (
    <ImageSegmentation
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      {...{
        interface: {
          type: "image_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          regionTypesAllowed: ["bounding-box", "polygon", "point"],
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
  .add("with hot keys", () => (
    <HotKeys
      keyMap={{
        zoom_tool: "z",
        pan_tool: "p",
      }}
    >
      <ImageSegmentation
        onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
        {...{
          interface: {
            type: "image_segmentation",
            description: "# Title\n\nLowercase",
            labels: ["valid", "invalid"],
<<<<<<< HEAD
            regionTypesAllowed: ["bounding-box", "polygon", "point"],
=======
            regionTypesAllowed: [
              "bounding-box",
              "polygon",
              "full-segmentation",
              "point",
              "pixel-mask",
            ],
>>>>>>> f7429f2... fix table view not displaying annotations, fix storybook errors, more
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
    </HotKeys>
  ))
<<<<<<< HEAD
  .add("full image segmentation", () => (
    <ImageSegmentation
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      {...{
        interface: {
          type: "image_pixel_segmentation",
          description: "# Title\n\nLowercase",
          labels: ["valid", "invalid"],
          regionTypesAllowed: ["bounding-box", "polygon", "point"],
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
=======
>>>>>>> f7429f2... fix table view not displaying annotations, fix storybook errors, more
