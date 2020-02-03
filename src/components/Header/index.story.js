// @flow

import React from "react"
import Button from "@material-ui/core/Button"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Header from "./"

storiesOf("Header", module)
  .add("Basic", () => (
    <Header
      title="Some Header"
      additionalButtons={[<Button>Switch to Sample Editor</Button>]}
      tabs={["Settings"]}
    />
  ))
  .add("Tab Test", () => (
    <Header
      title="Some Header"
      tabs={["Settings", "Samples", "Label"]}
      currentTab="Samples"
    />
  ))
