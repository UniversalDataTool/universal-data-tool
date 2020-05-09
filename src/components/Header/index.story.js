// @flow

import React from "react"

import { storiesOf } from "@storybook/react"

import Header from "./"

storiesOf("Header", module)
  .add("Tabs", () => (
    <Header
      title="Some Header"
      tabs={["Setup", "Samples", "Label"]}
      currentTab="Samples"
    />
  ))
  .add("Sample Color", () => (
    <Header
      title="Some Header"
      tabs={["Setup", "Samples", "Label"]}
      currentTab="Samples"
    />
  ))
