// @flow weak

import React, { useState, useEffect } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import TextAreaWithUpload from "../TextAreaWithUpload"
import * as colors from "@material-ui/core/colors"
import fromUDTCSV from "../../utils/from-udt-csv.js"

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

const ImportUDTFileDialog = ({ open, onClose, onAddSamples }) => {
  const [error, changeError] = useState(null)
  const [content, setContent] = useState("")

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Import JSON/CSV Samples"
      actions={[
        {
          text: "Add Samples",
          disabled: Boolean(error),
          onClick: () => {
            let taskData, taskOutput
            try {
              ;[taskData, taskOutput] = JSON.parse(content).taskData
            } catch (e1) {
              try {
                const udt = fromUDTCSV(content)
                ;({ taskData, taskOutput } = udt)
              } catch (e2) {
                changeError(
                  `JSON did not parse. CSV did not parse.\n\nJSON Error: ${e1.toString()}\nCSV Error: ${e2.toString()}`
                )
                return
              }
            }
            if (!taskData || taskData.length === 0) {
              changeError("No task data found")
              return
            }
            onAddSamples(taskData, taskOutput)
          },
        },
      ]}
    >
      <InfoText>
        See the{" "}
        <a
          target="_blank"
          href="https://github.com/UniversalDataTool/udt-format"
        >
          UDT JSON format
        </a>{" "}
        or the{" "}
        <a
          target="_blank"
          href="https://github.com/UniversalDataTool/udt-format"
        >
          UDT CSV format
        </a>{" "}
        for formatting details. Or take a look at a{" "}
        <a
          target="_blank"
          href="https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.json"
        >
          sample JSON
        </a>{" "}
        or{" "}
        <a
          target="_blank"
          href="https://github.com/UniversalDataTool/udt-format/blob/master/SAMPLE.udt.csv"
        >
          sample CSV
        </a>{" "}
        file.
      </InfoText>
      <Error>{error}</Error>
      <TextAreaWithUpload
        content={content}
        onChangeContent={setContent}
        placeholder={
          "Paste CSV/JSON here. The file should be in the UDT JSON/CSV format.\n\nYou can also drag a json or csv file here (double click to open file dialog)"
        }
      />
    </SimpleDialog>
  )
}

export default ImportUDTFileDialog
