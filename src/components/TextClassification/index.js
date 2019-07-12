import React, { useState } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"

export const TextClassification = props => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
  const initialLabels =
    props.taskOutput && props.taskOutput[currentSampleIndex]
      ? [props.taskOutput[currentSampleIndex].label] ||
        props.taskOutput[currentSampleIndex].labels
      : undefined
  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.taskData.length}
      description={
        getTaskDescription(props.taskData[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={sampleIndex => changeCurrentSampleIndex(sampleIndex)}
    >
      <NLPAnnotator
        key={currentSampleIndex}
        type="label-document"
        labels={props.interface.labels}
        multipleLabels={props.interface.multiple}
        document={props.taskData[currentSampleIndex].document}
        initialLabels={initialLabels}
        onFinish={result => {
          props.onSaveTaskOutput(currentSampleIndex, result)
        }}
      />
    </SampleContainer>
  )
}

export default TextClassification
