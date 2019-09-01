// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import LocalStorageApp from "./"

storiesOf("LocalStorageApp", module).add("Basic", () => <LocalStorageApp />)
