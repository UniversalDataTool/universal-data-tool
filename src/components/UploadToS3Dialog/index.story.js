// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import UploadToS3Dialog from "./"

storiesOf("UploadToS3Dialog", module).add("Basic", () => (
  <UploadToS3Dialog
    open
    onAddSamples={action("onAddSamples")}
    onClose={action("onClose")}
  />
))
