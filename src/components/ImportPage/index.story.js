// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImportPage from "./"

storiesOf("ImportPage", module)
  .add("Basic", () => (
    <ImportPage
      isDesktop={false}
      dataset={{
        interface: {
          type: "image_segmentation",
          labels: ["valid", "invalid"],
          regionTypesAllowed: [
            "bounding-box",
            "polygon",
            // "full-segmentation",
            "point",
            // "pixel-mask"
          ],
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
      }}
      onChangeDataset={action("onChangeDataset")}
    />
  ))
  .add("Basic Desktop", () => (
    <ImportPage
      isDesktop
      dataset={{
        interface: {
          type: "image_segmentation",
          labels: ["valid", "invalid"],
          regionTypesAllowed: [
            "bounding-box",
            "polygon",
            // "full-segmentation",
            "point",
            // "pixel-mask"
          ],
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
      }}
      onChangeDataset={action("onChangeDataset")}
    />
  ))
