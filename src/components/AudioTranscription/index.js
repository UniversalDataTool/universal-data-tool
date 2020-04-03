// @flow weak

import React, { useState } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"

export default (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)

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
      onChangeSample={(sampleIndex) => changeCurrentSampleIndex(sampleIndex)}
    >
      <NLPAnnotator
        key={(props.sampleIndex || 0) + currentSampleIndex}
        type="transcribe"
        audio={props.taskData[currentSampleIndex].audioUrl}
        phraseBank={props.phraseBank}
        initialTranscriptionText={
          (props.taskOutput || [])[currentSampleIndex] || ""
        }
        onFinish={(result) => {
          props.onSaveTaskOutputItem(currentSampleIndex, result)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}
