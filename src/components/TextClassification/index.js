import React from "react"
import NLPAnnotator from "react-nlp-annotate"
import useClobberedState from "../../hooks/use-clobbered-state"

export const TextClassification = (props) => {
  const [currentSampleIndex, setCurrentSampleIndex] = useClobberedState(
    props.sampleIndex,
    0
  )
  const { annotation } = props.samples[currentSampleIndex]
  // TODO remove legacy support for availableLabels
  if (!props.interface.labels && props.interface.availableLabels) {
    props.interface.labels = props.interface.availableLabels
  }
  const initialLabels = annotation
    ? typeof annotation === "string"
      ? [annotation]
      : annotation
    : undefined
  if (!props.interface.labels) {
    throw new Error("Labels not defined. Try defining some labels in Setup")
  }
  let labels = props.interface.labels
    .map((l) =>
      typeof l === "string" ? { id: l, description: l, displayName: l } : l
    )
    .map((l) => (!l.displayName ? { ...l, displayName: l.id } : l))
  return (
    <NLPAnnotator
      key={currentSampleIndex}
      type="label-document"
      labels={labels}
      multipleLabels={props.interface.multiple}
      document={props.samples[currentSampleIndex].document}
      initialLabels={initialLabels}
      hotkeysEnabled={!props.disableHotkeys}
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
        props.onExit()
      }}
    />
  )
}

export default TextClassification
