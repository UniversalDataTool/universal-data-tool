// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { templateMap } from "../StartingPage/templates"
import range from "lodash/range"

import SamplesView from "./"

const exampleSample = templateMap["image_classification"].dataset.samples[0]

storiesOf("SamplesView", module)
  .add("Basic", () => (
    <SamplesView
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
            annotation: [
              {
                regionType: "bounding-box",
                centerX: 0.29559748427672955,
                centerY: 0.3188679245283019,
                width: 0.42515723270440253,
                height: 0.16226415094339625,
                classification: "valid",
                color: "hsl(49,100%,50%)",
              },
            ],
          },
          {
            imageUrl:
              "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
          },
        ],
      }}
      openSampleInputEditor={action("openSampleInputEditor")}
      openSampleLabelEditor={action("openSampleLabelEditor")}
      deleteSample={action("deleteSample")}
      onChangeDataset={action("onChangeDataset")}
      onChangeFile={action("onChangeFile")}
    />
  ))
  .add("10,000 Samples", () => (
    <SamplesView
      dataset={{
        ...templateMap["image_classification"].dataset,
        samples: range(10000).map((i) => exampleSample),
      }}
      openSampleInputEditor={action("openSampleInputEditor")}
      openSampleLabelEditor={action("openSampleLabelEditor")}
      deleteSample={action("deleteSample")}
      onChangeDataset={action("onChangeDataset")}
      onChangeFile={action("onChangeFile")}
    />
  ))
