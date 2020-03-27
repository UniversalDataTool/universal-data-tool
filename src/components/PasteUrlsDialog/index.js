// @flow weak
import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300
})

export default ({ open, onClose, onAddSamples }) => {
  const [content, changeContent] = useState("")
  return (
    <SimpleDialog
      title="Paste Urls"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            onAddSamples(
              content
                .split("\n")
                .map(l => l.trim())
                .filter(Boolean)
                .map(s => {
                  const extension = s.split(".").slice(-1)[0]
                  switch (extension.toLowerCase()) {
                    case "png":
                    case "jpg":
                    case "gif":
                    case "jpeg":
                    case "bmp": {
                      return { imageUrl: s }
                    }
                    case "pdf": {
                      return { pdfUrl: s }
                    }
                    case "mp3":
                    case "wav": {
                      return { audioUrl: s }
                    }
                    default: {
                      // TODO throw error or toast
                      console.error("extension not recognized")
                      return null
                    }
                  }
                })
                .filter(Boolean)
            )
          }
        }
      ]}
    >
      <TextArea
        onChange={(e, v) => changeContent(e.target.value)}
        placeholder={"Paste URLs here\nOne URL per line"}
      />
    </SimpleDialog>
  )
}
