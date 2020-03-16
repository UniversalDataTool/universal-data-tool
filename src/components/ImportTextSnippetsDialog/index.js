// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import { useDropzone } from "react-dropzone"
import useEventCallback from "use-event-callback"
import * as colors from "@material-ui/core/colors"

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300
})

const UploadHover = styled("div")({
  fontSize: 24,
  color: colors.grey[600],
  textAlign: "center",
  padding: 48
})

const emptyFunc = () => null

const ImportTextSnippetsDialog = ({ open, onClose, onAddSamples }) => {
  const [content, changeContent] = useState("")

  const onDrop = useEventCallback(acceptedFiles => {
    const { name: fileName } = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = e => {
      const fileContent = e.target.result
      if (fileName.endsWith("csv") || fileName.endsWith("CSV")) {
        changeContent(fileContent.replace(",", "\n"))
      } else {
        changeContent(fileContent)
      }
    }
    reader.readAsText(acceptedFiles[0])
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
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
                .map(l => l.trim())
                .filter(Boolean)
                .map(s => ({ document: s }))
            )
          }
        }
      ]}
    >
      <div {...getRootProps()} onClick={emptyFunc}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <UploadHover>Drop the text or csv file here.</UploadHover>
        ) : (
          <TextArea
            value={content}
            onChange={(e, v) => changeContent(e.target.value)}
            placeholder={
              "Paste Snippets here\nOne snippet per line.\n\nYou can also drag a text or csv file here."
            }
          />
        )}
      </div>
    </SimpleDialog>
  )
}

export default ImportTextSnippetsDialog
