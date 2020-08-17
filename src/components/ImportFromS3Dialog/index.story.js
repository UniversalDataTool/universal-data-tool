// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImportFromS3Dialog from "./"

// NOTE: THIS STORY REQUIRES the localStorage app_config to have s3 auth options!! It won't
// work by default!

storiesOf("ImportFromS3Dialog", module).add(
  "Basic (doesn't work by default)",
  () => <ImportFromS3Dialog open onAddSamples={action("onAddSamples")} />
)
