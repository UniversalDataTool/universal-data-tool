
// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Waveform from "./"

storiesOf("Waveform", module).add("Basic", () => (
    <Waveform />
))