// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import StartingPage from "./"

storiesOf("StartingPage", module).add("Basic", () => (
  <StartingPage onOpenTemplate={action("onOpenTemplate")} />
))
