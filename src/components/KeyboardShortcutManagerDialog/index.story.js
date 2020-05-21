import React from "react"

import { storiesOf } from "@storybook/react"

import KeyboardShortcutManagerDialog from "./index.js"

storiesOf("KeyboardShortcutManagerDialog", module).add("Basic", () => {
  return <KeyboardShortcutManagerDialog open={true} />
})
