import React, { useState } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"

export const TextClassification = (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
  const { annotation } = props.samples[currentSampleIndex]
  const initialLabels = annotation
    ? typeof annotation === "string"
      ? [annotation]
      : annotation
    : undefined
  if (!props.interface.labels && !props.interface.availableLabels) {
    throw new Error("Labels not defined. Try defining some labels in Setup")
  }
  let labels = (props.interface.labels || props.interface.availableLabels)
    .map((l) =>
      typeof l === "string" ? { id: l, description: l, displayName: l } : l
    )
    .map((l) => (!l.displayName ? { ...l, displayName: l.id } : l))
  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.samples.length}
      taskOutput={props.samples}
      description={
        getTaskDescription(props.samples[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={(sampleIndex) => changeCurrentSampleIndex(sampleIndex)}
    >
      <NLPAnnotator
        key={(props.sampleIndex || 0) + currentSampleIndex}
        type="label-document"
        labels={labels}
        multipleLabels={props.interface.multiple}
        document={props.samples[currentSampleIndex].document}
        initialLabels={initialLabels}
        onFinish={(result) => {
          props.onSaveTaskOutputItem(currentSampleIndex, result)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default TextClassification
