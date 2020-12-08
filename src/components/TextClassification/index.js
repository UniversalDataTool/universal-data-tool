import React from "react"
import NLPAnnotator from "react-nlp-annotate"

export const TextClassification = ({
  sample,
  interface: iface,
  onExit,
  sampleIndex,
  onModifySample,
  disableHotkeys,
}) => {
  const { annotation = null } = sample || {}

  const initialLabels = annotation
    ? typeof annotation === "string"
      ? [annotation]
      : annotation
    : undefined
  if (!iface.labels) {
    throw new Error("Labels not defined. Try defining some labels in Setup")
  }
  let labels = iface.labels
    .map((l) =>
      typeof l === "string" ? { id: l, description: l, displayName: l } : l
    )
    .map((l) => (!l.displayName ? { ...l, displayName: l.id } : l))
  return (
    <NLPAnnotator
      key={sampleIndex}
      type="label-document"
      labels={labels}
      multipleLabels={iface?.multiple}
      separatorRegex={iface?.wordSplitRegex}
      document={sample?.document}
      initialLabels={initialLabels}
      hotkeysEnabled={!disableHotkeys}
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

export default TextClassification
