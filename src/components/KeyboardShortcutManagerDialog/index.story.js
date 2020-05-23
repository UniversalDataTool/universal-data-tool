import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import KeyboardShortcutManagerDialog from "./index.js"

storiesOf("KeyboardShortcutManagerDialog", module).add("Basic", () => {
  return (
    <KeyboardShortcutManagerDialog
      open={true}
      onClose={action("onClose")}
      onChangeHotkey={action("onChangeHotkey")}
      hotkeyList={[
        { hotkey: "ctrl+s", description: "Save File" },
        { hotkey: "n", description: "Next" },
        { hotkey: "p", description: "Prev" },
      ]}
    />
  )
})
