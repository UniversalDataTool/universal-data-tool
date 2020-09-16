// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import SetupPage from "./"

storiesOf("SetupPage", module).add("Empty Dataset", () => {
  const [dataset, setDataset] = useState({
    interface: {},
  })

  return (
    <SetupPage
      dataset={dataset}
      onChange={setDataset}
      onClearLabelData={action("onClearLabelData")}
    />
  )
})
