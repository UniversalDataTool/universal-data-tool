// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ConfigureInterface from "./"

storiesOf("ConfigureInterface", module).add("Data Entry", () => {
  const [iface, changeIFace] = useState({ type: "data_entry" })
  const dataset = { interface: iface }
  return (
    <ConfigureInterface
      dataset={dataset}
      onChange={(...args) => {
        action("onChange")(...args)
        changeIFace(args[0])
      }}
    />
  )
})
