// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import TextAreaWithUpload from "../TextAreaWithUpload"

const ImportTextSnippetsDialog = ({ open, onClose, onAddSamples }) => {
  const [content, changeContent] = useState("")

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Import Text Snippets"
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            onAddSamples(
              content
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
                .map((s) => ({ document: s }))
            )
          },
        },
      ]}
    >
      <TextAreaWithUpload
        content={content}
        onChangeContent={changeContent}
        placeholder={
          "Paste Snippets here\nOne snippet per line.\n\nYou can also drag a text or csv file here (double click to open file dialog)"
        }
      />
    </SimpleDialog>
  )
}

export default ImportTextSnippetsDialog
