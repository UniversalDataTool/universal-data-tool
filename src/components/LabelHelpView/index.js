import React from "react"
import { styled } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import APIKeyEntry from "./api-key-entry.js"
import PaperContainer from "../PaperContainer"
import LabelHelpDialogContent from "./label-help-dialog-content"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

export const useLabelHelp = () => {
  return {
    labelHelpEnabled: true,
    formula:
      "(0.06 + number_of_fields * 0.02 + text_field_count * 0.1 + total_labels * 0.005 + 0.07 * total_bounding_boxes) * sample_count",
    variables: {
      number_of_fields: 3,
      text_field_count: 5,
      total_labels: 20,
      total_bounding_boxes: 0,
      sample_count: 1000,
    },
    price: 104,
  }
}

export const LabelHelpView = () => {
  return (
    <Container>
      {/* <APIKeyEntry /> */}
      <PaperContainer style={{ marginTop: 64, width: "100%", maxWidth: 800 }}>
        <LabelHelpDialogContent />
      </PaperContainer>
    </Container>
  )
}

export default LabelHelpView
