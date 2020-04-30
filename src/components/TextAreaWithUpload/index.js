// @flow weak

import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import { useDropzone } from "react-dropzone"
import * as colors from "@material-ui/core/colors"

const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300,
})

const UploadHover = styled("div")({
  fontSize: 24,
  color: colors.grey[600],
  textAlign: "center",
  padding: 48,
})

const emptyFunc = () => null

export default ({ content, onChangeContent, placeholder }) => {
  const onDrop = useEventCallback((acceptedFiles) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result
      onChangeContent(fileContent)
    }
    reader.readAsText(acceptedFiles[0])
  })

  const [lastClickTime, changeLastClickTime] = useState(0)
  const onClick = useEventCallback((e) => {
    if (Date.now() - lastClickTime < 400) {
      getRootProps().onClick(e)
    }
    changeLastClickTime(Date.now())
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} onClick={emptyFunc}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <UploadHover>Drop the text or csv file here.</UploadHover>
      ) : (
        <TextArea
          value={content}
          onChange={(e, v) => onChangeContent(e.target.value)}
          onClick={onClick}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
