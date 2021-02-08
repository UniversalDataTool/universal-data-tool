// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import { Notification } from "./"

storiesOf("toast notification", module).add("Basic", () => (
  <div>
    <Notification
      type="info"
      message="This is main info message text"
      onClose={action("onClose")}
    />
    <Notification
      type="error"
      message="This is main error message text"
      onClose={action("onClose")}
    />
    <Notification
      type="success"
      message="This is main success message text"
      onClose={action("onClose")}
    />
    <Notification
      type="warning"
      message="This is main warning message text"
      onClose={action("onClose")}
    />
    <Notification
      type="notUsedType"
      message="This is main notUsedType message text"
      onClose={action("onClose")}
    />
  </div>
))
