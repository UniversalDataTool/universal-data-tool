import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import useClobberedState from "../../hooks/use-clobbered-state"
import Box from "@material-ui/core/Box"
import {
  simpleSequenceToEntitySequence,
  entitySequenceToSimpleSeq,
} from "./convert-react-nlp-annotate-types"

export const TextEntityRecognition = (props) => {
  const [currentSampleIndex, setCurrentSampleIndex] = useClobberedState(
    props.sampleIndex,
    0
  )
  const initialSequence = props.samples[currentSampleIndex].annotation
    ? entitySequenceToSimpleSeq(
        props.samples[currentSampleIndex].document,
        props.samples[currentSampleIndex].annotation.entities
      )
    : undefined

  if (!props.interface.labels && !props.interface.availableLabels) {
    throw new Error("Labels not defined. Try adding some labels in setup.")
  }

  return (
    <NLPAnnotator
      key={currentSampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {currentSampleIndex}</Box>}
      type="label-sequence"
      document={props.samples[currentSampleIndex].document}
      labels={props.interface.labels || props.interface.availableLabels}
      initialSequence={initialSequence}
      hotkeysEnabled={!props.disableHotkeys}
      onPrev={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, {
          entities: simpleSequenceToEntitySequence(result),
        })
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex - 1)
        } else {
          props.onExit("go-to-previous")
        }
      }}
      onNext={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, {
          entities: simpleSequenceToEntitySequence(result),
        })
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex + 1)
        } else {
          props.onExit("go-to-next")
        }
      }}
      onFinish={(result) => {
        props.onSaveTaskOutputItem(currentSampleIndex, {
          entities: simpleSequenceToEntitySequence(result),
        })
        props.onExit()
      }}
    />
  )
}

export default TextEntityRecognition
