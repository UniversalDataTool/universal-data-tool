// @flow weak
import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import Select from "react-select"
import * as colors from "@material-ui/core/colors"

const SelectContainer = styled("div")({
  marginTop: 8,
  marginBottom: 16,
})
const TextArea = styled("textarea")({
  width: "100%",
  minHeight: 300,
})
const ErrorText = styled("div")({
  color: colors.red[600],
  padding: 16,
})

const autoDetectOptions = [
  {
    label: "Auto Detect File Type",
    value: "auto_detect",
  },
  {
    label: "Image URLs",
    value: "images",
  },
]

export default ({ open, onClose, onAddSamples }) => {
  const [content, changeContent] = useState("")
  const [urlType, changeURLType] = useState("auto_detect")
  const [error, setError] = useState("")
  return (
    <SimpleDialog
      title="Paste Urls"
      open={open}
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            try {
              onAddSamples(
                content
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((s) => {
                    if (urlType === "images") {
                      return { imageUrl: s }
                    }
                    let extension = s
                      .replace(/\?.*/g, "")
                      .split(".")
                      .slice(-1)[0]
                    if (s.includes("gstatic.com/images")) {
                      extension = "jpg"
                    }
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
                        throw new Error(
                          `extension not recognized: "${extension}" in "${s}"`
                        )
                        // TODO if the user doesn't care, return null (this
                        // behavior could be enabled with textfield option)
                      }
                    }
                  })
                  .filter(Boolean)
              )
            } catch (e) {
              setError(e.toString())
            }
          },
        },
      ]}
    >
      <SelectContainer>
        <Select
          options={autoDetectOptions}
          defaultValue={autoDetectOptions[0]}
          onChange={(opt) => {
            changeURLType(opt.value)
          }}
        />
      </SelectContainer>
      {error && <ErrorText>{error}</ErrorText>}
      <TextArea
        onChange={(e, v) => changeContent(e.target.value)}
        placeholder={"Paste URLs here\nOne URL per line"}
      />
    </SimpleDialog>
  )
}
