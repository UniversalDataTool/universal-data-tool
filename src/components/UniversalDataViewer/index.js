import React, { useMemo } from "react"
import TextClassification from "../TextClassification"
import TextEntityRecognition from "../TextEntityRecognition"
import DataEntry from "../DataEntry"

export const UniversalDataViewer = ({
  oha,
  hideHeader,
  hideDescription,
  onSaveTaskOutputItem
}) => {
  // TODO type check w/ superstruct against oha
  const containerProps = useMemo(
    () => ({
      hideHeader,
      hideDescription
    }),
    [hideHeader, hideDescription]
  )

  switch (oha.interface.type) {
    case "data_entry":
      return (
        <DataEntry
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    default:
      return `"${oha.interface.type}" not supported`
  }
}

export default UniversalDataViewer
