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
  let labels = props.interface.labels
    .map(l =>
      typeof l === "string" ? { id: l, description: l, displayName: l } : l
    )
    .map(l => (!l.displayName ? { ...l, displayName: l.id } : l))
  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.taskData.length}
      taskOutput={props.taskOutput}
      description={
        getTaskDescription(props.taskData[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={sampleIndex => changeCurrentSampleIndex(sampleIndex)}
    >
      <NLPAnnotator
        key={(props.sampleIndex || 0) + currentSampleIndex}
        type="label-document"
        labels={labels}
        multipleLabels={props.interface.multiple}
        document={props.taskData[currentSampleIndex].document}
        initialLabels={initialLabels}
        onFinish={result => {
          if (typeof result === "string") result = { label: result }
          else result = { labels: result }
          props.onSaveTaskOutputItem(currentSampleIndex, result)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default TextClassification
