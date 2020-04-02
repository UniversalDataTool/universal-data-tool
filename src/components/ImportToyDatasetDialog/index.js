// @flow weak

import React from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

const StyledButton = styled(Button)({})

const datasets = [
  { name: "Elon Musk Tweets", type: "text", size: 2700 },
  { name: "Cats", type: "image", size: 320 },
  { name: "VR Hand Pinching", type: "image", size: 8000 },
  { name: "Text to Speech Samples", type: "audio", size: 100 }
]

async function getSamples(dataset) {
  switch (dataset.name.toLowerCase().replace(/ /g, "_")) {
    case "elon_musk_tweets": {
    }
    case "cats": {
    }
    case "vr_hand_pinching": {
    }
    case "text_to_speech_samples": {
    }
  }
}

const StyledButton = styled(Button)({})

const ImportToyDatasetDialog = ({ onClose, onAddSamples, open }) => {
  return (
    <SimpleDialog onClose={onClose} open={open} title="Import Toy Dataset">
      {datasets.map(dataset => (
        <StyledButton variant="outlined" key={dataset.name}>
          {dataset.name}
        </StyledButton>
      ))}
    </SimpleDialog>
  )
}

export default ImportToyDatasetDialog
