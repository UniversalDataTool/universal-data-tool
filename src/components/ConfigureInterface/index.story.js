// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ConfigureInterface from "./"

storiesOf("ConfigureInterface", module).add("Data Entry", () => {
  const [iface, changeIFace] = useState({ type: "data_entry" })
  console.log({ iface })
  return (
    <ConfigureInterface
      iface={iface}
      onChange={(...args) => {
        action("onChange")(...args)
        console.log(args[0])
        changeIFace(args[0])
      }}
    />
  )
})
