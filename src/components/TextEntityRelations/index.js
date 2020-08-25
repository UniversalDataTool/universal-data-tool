import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import useClobberedState from "../../utils/use-clobbered-state"
import Box from "@material-ui/core/Box"
import {
  simpleSequenceAndRelationsToEntitySequence,
  entitySequenceToSimpleSeq,
} from "../TextEntityRecognition/convert-react-nlp-annotate-types"

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

  const initialRelations =
    props.samples[currentSampleIndex].annotation.relations

  if (!props.interface.relationLabels) {
    throw new Error(
      "Relation labels not defined. Try adding some labels in setup."
    )
  }

  return (
    <NLPAnnotator
      key={currentSampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {currentSampleIndex}</Box>}
      type="label-relationships"
      document={props.samples[currentSampleIndex].document}
      entityLabels={props.interface.entityLabels}
      relationshipLabels={props.interface.relationLabels}
      initialSequence={initialSequence}
      initialRelationships={initialRelations}
      onPrev={(result) => {
        props.onSaveTaskOutputItem(
          currentSampleIndex,
          simpleSequenceAndRelationsToEntitySequence(result)
        )
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex - 1)
        } else {
          props.onExit("go-to-previous")
        }
      }}
      onNext={(result) => {
        props.onSaveTaskOutputItem(
          currentSampleIndex,
          simpleSequenceAndRelationsToEntitySequence(result)
        )
        if (setCurrentSampleIndex) {
          setCurrentSampleIndex(currentSampleIndex + 1)
        } else {
          props.onExit("go-to-next")
        }
      }}
      onFinish={(result) => {
        props.onSaveTaskOutputItem(
          currentSampleIndex,
          simpleSequenceAndRelationsToEntitySequence(result)
        )
        props.onExit()
      }}
    />
  )
}

export default TextEntityRecognition
