// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import PremiumStartingPage from "./"

storiesOf("PremiumStartingPage", module).add("Basic", () => (
  <PremiumStartingPage onOpenTemplate={action("onOpenTemplate")} />
))
