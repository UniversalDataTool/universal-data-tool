// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { templateMap } from "../StartingPage/templates.js"

import LabelView from "./"

storiesOf("LabelView", module).add("Basic", () => (
  <LabelView
    dataset={templateMap.image_classification.dataset}
    onChangeDataset={action("onChangeDataset")}
    singleSampleDataset={null}
    onChangeSingleSampleDataset={action("onChangeSingleSampleDataset")}
    onClickSetup={action("onClickSetup")}
    onChangeSampleTimeToComplete={action("onChangeSampleTimeToComplete")}
    sampleTimeToComplete={2500}
  />
))
