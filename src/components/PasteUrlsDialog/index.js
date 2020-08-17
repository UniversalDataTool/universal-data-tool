// @flow weak
import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import Select from "react-select"
import * as colors from "@material-ui/core/colors"
import getSampleFromUrl from "./get-sample-from-url"

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
                  .map((s) =>
                    urlType === "images"
                      ? { imageUrl: s }
                      : getSampleFromUrl(s, { returnNulls: true })
                  )
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
