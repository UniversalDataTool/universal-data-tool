// @flow weak

import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import useClobberedState from "../../utils/use-clobbered-state"
import Box from "@material-ui/core/Box"

export default (props) => {
  const [currentSampleIndex, setCurrentSampleIndex] = useClobberedState(
    props.sampleIndex,
    0
  )

  const sample = props.samples[currentSampleIndex]

  return (
    <NLPAnnotator
      key={currentSampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {currentSampleIndex}</Box>}
      type="transcribe"
      audio={sample.audioUrl}
      phraseBank={props.phraseBank}
      initialTranscriptionText={sample.annotation || ""}
      onPrev={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, result)
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex - 1)
        } else {
          props.onExit("go-to-previous")
        }
      }}
      onNext={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, result)
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex + 1)
        } else {
          props.onExit("go-to-next")
        }
      }}
      onFinish={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, result)
        if (props.onExit) props.onExit()
      }}
    />
  )
}
