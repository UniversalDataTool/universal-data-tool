// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import UniversalDataViewer from "./"

storiesOf("UniversalDataViewer", module).add("Basic", () => (
  <UniversalDataViewer oha={{}} />
))
