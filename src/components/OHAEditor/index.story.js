// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import OHAEditor from "./"

const Controller = ({ initialOHA }) => {
  const [oha, changeOHA] = useState(initialOHA)
  return <OHAEditor oha={oha} onChangeOHA={changeOHA} />
}

storiesOf("OHAEditor", module).add("Basic", () => (
  <Controller initialOHA={{}} />
))
