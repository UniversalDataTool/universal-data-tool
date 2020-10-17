// @flow weak

import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import Box from "@material-ui/core/Box"

export default ({
  sampleIndex,
  sample,
  interface: iface,
  onModifySample,
  onExit,
}) => {
  return (
    <NLPAnnotator
      key={sampleIndex}
      titleContent={<Box paddingLeft={4}>Sample {sampleIndex}</Box>}
      type="transcribe"
      audio={sample.audioUrl}
      phraseBank={iface.phraseBank}
      initialTranscriptionText={sample.annotation || ""}
      onPrev={(result) => {
        onModifySample({ ...sample, annotation: result })
        onExit("go-to-previous")
      }}
      onNext={(result) => {
        onModifySample({ ...sample, annotation: result })
        onExit("go-to-next")
      }}
      onFinish={(result) => {
        onModifySample({ ...sample, annotation: result })
        onExit()
      }}
    />
  )
}
