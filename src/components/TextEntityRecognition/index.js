import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import useClobberedState from "../../hooks/use-clobbered-state"
import Box from "@material-ui/core/Box"
import {
  simpleSequenceToEntitySequence,
  entitySequenceToSimpleSeq,
} from "./convert-react-nlp-annotate-types"

export const TextEntityRecognition = ({
  sample,
  interface: iface,
  onModifySample,
  disableHotkeys,
  sampleIndex,
  onExit,
}) => {
  const initialSequence = sample?.annotation
    ? entitySequenceToSimpleSeq(sample?.document, sample?.annotation.entities)
    : []

  if (!iface?.labels) {
    throw new Error("Labels not defined. Try adding some labels in setup.")
  }

  return (
    <NLPAnnotator
      key={sampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {sampleIndex}</Box>}
      type="label-sequence"
      document={sample?.document}
      labels={iface?.labels}
      initialSequence={initialSequence}
      hotkeysEnabled={!disableHotkeys}
      onPrev={(result) => {
        const annotation = {
          entities: simpleSequenceToEntitySequence(result),
        }
        onModifySample({ ...sample, annotation })
        onExit("go-to-previous")
      }}
      onNext={(result) => {
        const annotation = {
          entities: simpleSequenceToEntitySequence(result),
        }
        onModifySample({ ...sample, annotation })
        onExit("go-to-next")
      }}
      onFinish={(result) => {
        const annotation = {
          entities: simpleSequenceToEntitySequence(result),
        }
        onModifySample({ ...sample, annotation })
        onExit()
      }}
    />
  )
}

export default TextEntityRecognition
