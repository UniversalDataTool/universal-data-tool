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
      dataset={templateMap["image_classification"].dataset}
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
