// @flow

import React from "react"
import Button from "@material-ui/core/Button"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Header from "./"

storiesOf("Header", module)
  .add("Tabs", () => (
    <Header
      title="Some Header"
      tabs={["Settings", "Samples", "Label"]}
      currentTab="Samples"
    />
  ))
  .add("Sample Color", () => (
    <Header
      title="Some Header"
      tabs={["Settings", "Samples", "Label"]}
      currentTab="Samples"
    />
  ))
