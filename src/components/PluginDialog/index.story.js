// @flow

import React from "react"

import { storiesOf } from "@storybook/react"

import PluginDialog from "./"

storiesOf("PluginDialog", module).add("Basic", () => {
  const renderDialog = ({
    elm,
    dataset,
    setInDataset,
    addAction,
    removeAction,
    onSuccess,
  }) => {
    elm.innerHTML = `

      Click the "Delete All Samples" button to delete all of your samples!

      `.trim()

    addAction({
      text: "Delete All Samples",
      onClick: () => {
        setInDataset(dataset, ["samples"], [])
        onSuccess("All samples deleted!")
      },
    })
  }
  return (
    <PluginDialog
      open={true}
      name="Delete All Samples"
      renderDialog={renderDialog}
    />
  )
})
