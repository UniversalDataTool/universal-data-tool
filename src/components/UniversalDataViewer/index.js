import React from "react"
import TextClassification from "../TextClassification"
import TextEntityRecognition from "../TextEntityRecognition"
import DataEntry from "../DataEntry"

export const UniversalDataViewer = ({ oha }) => {
  // TODO type check w/ superstruct against oha
  switch (oha.interface.type) {
    case "data_entry":
      return <DataEntry {...oha} />
    case "text_classification":
      return <TextClassification {...oha} />
    case "text_entity_recognition":
      return <TextEntityRecognition {...oha} />
    default:
      return `"${oha.interface.type}" not supported`
  }
}

export default UniversalDataViewer
