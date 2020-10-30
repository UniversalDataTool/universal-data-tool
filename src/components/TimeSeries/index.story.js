// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TimeSeries from "./"

storiesOf("TimeSeries", module).add("Basic", () => (
  <TimeSeries
    onModifySample={action("onModifySample")}
    {...{
      interface: {
        type: "time_series",
      },
      sample: {
        timeData: [
          { time: 0, value: 0 },
          { time: 500, value: 1 },
          { time: 1000, value: 0.25 },
        ],
      },
    }}
  />
))
