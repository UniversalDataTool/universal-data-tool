// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import OHAEditor from "./"

const Controller = props => {
  const [oha, changeOHA] = useState(props.initialOHA)
  return <OHAEditor oha={oha} onChangeOHA={changeOHA} {...props} />
}

storiesOf("OHAEditor", module).add("Basic", () => (
  <Controller
    initialOHA={{}}
    onChangeFileName={action("onChangeFileName")}
    onChangeOHA={action("onChangeOHA")}
  />
))
