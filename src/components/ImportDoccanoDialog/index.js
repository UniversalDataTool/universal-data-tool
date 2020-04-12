// @flow weak

import React, { useState, useEffect } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import TextAreaWithUpload from "../TextAreaWithUpload"
import * as colors from "@material-ui/core/colors"

const InfoText = styled("div")({
  fontFamily: "Inter",
  marginBottom: 20,
  "& a": {
    color: colors.blue[500],
  },
})

const Error = styled("div")({
  color: colors.red[500],
  whiteSpace: "pre-wrap",
  marginBottom: 20,
})

const ImportDoccanoDialog = ({ open, onClose, onAddSamples }) => {
  const [error, changeError] = useState(null)
  const [content, setContent] = useState("")

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Import Doccano"
      actions={[
        {
          text: "Add Samples",
          onClick: () => {
            changeError(null)
            // TODO parse doccano content
            // onAddSamples(taskData, taskOutput)
          },
        },
      ]}
    >
      <InfoText>
        Import a Doccano JSON file as{" "}
        <a href="https://github.com/doccano/doccano/wiki/Import-and-Export-File-Formats">
          defined here
        </a>
        .
      </InfoText>
      <Error>{error}</Error>
      <TextAreaWithUpload
        content={content}
        onChangeContent={setContent}
        placeholder={
          "Paste doccano JSON file here.\n\nYou can also drag a json or csv file here (double click to open file dialog)"
        }
      />
    </SimpleDialog>
  )
}

export default ImportDoccanoDialog
