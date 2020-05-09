// @flow

import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import AceEditor from "react-ace"
import SimpleDialog from "../SimpleDialog"

export default ({ open, sampleIndex, sampleInput, onChange, onClose }) => {
  const [text, changeText] = useState()
  const [error, changeError] = useState()
  useEffect(() => {
    const newText = JSON.stringify(sampleInput, null, "  ")
    if (newText !== text) {
      changeText(newText)
      changeError(null)
    }
  }, [sampleIndex, sampleInput, text])

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title={`samples[${sampleIndex}]`}
    >
      <AceEditor
        theme="github"
        mode="javascript"
        width="100%"
        value={text}
        editorProps={{ $blockScrolling: Infinity }}
        onChange={(t) => {
          changeText(t)
          changeError(null)
          try {
            onChange(JSON.parse(t))
          } catch (e) {
            changeError(e.toString())
          }
        }}
      />
      <Box color="red">{error}</Box>
    </SimpleDialog>
  )
}
