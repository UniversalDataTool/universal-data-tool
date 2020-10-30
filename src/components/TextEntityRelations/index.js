import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import Box from "@material-ui/core/Box"
import {
  simpleSequenceAndRelationsToEntitySequence,
  entitySequenceToSimpleSeq,
} from "../TextEntityRecognition/convert-react-nlp-annotate-types"

export const TextEntityRelations = ({
  sample,
  interface: iface,
  onExit,
  onModifySample,
  disableHotkeys,
  sampleIndex,
}) => {
  const initialSequence = sample?.annotation
    ? entitySequenceToSimpleSeq(sample?.document, sample?.annotation?.entities)
    : undefined

  const initialRelations = sample?.annotation?.relations || []

  if (!iface?.relationLabels) {
    throw new Error(
      "Relation labels not defined. Try adding some labels in setup."
    )
  }

  return (
    <NLPAnnotator
      key={sampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {sampleIndex}</Box>}
      type="label-relationships"
      separatorRegex={iface?.wordSplitRegex}
      document={sample?.document}
      entityLabels={iface?.entityLabels}
      relationshipLabels={iface?.relationLabels}
      initialSequence={initialSequence}
      initialRelationships={initialRelations}
      hotkeysEnabled={!disableHotkeys}
      onPrev={(result) => {
        onModifySample({
          ...sample,
          annotation: simpleSequenceAndRelationsToEntitySequence(result),
        })
        onExit("go-to-previous")
      }}
      onNext={(result) => {
        onModifySample({
          ...sample,
          annotation: simpleSequenceAndRelationsToEntitySequence(result),
        })
        onExit("go-to-next")
      }}
      onFinish={(result) => {
        onModifySample({
          ...sample,
          annotation: simpleSequenceAndRelationsToEntitySequence(result),
        })
        onExit()
      }}
    />
  )
}

export default TextEntityRelations
