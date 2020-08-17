import React from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"
import useClobberedState from "../../utils/use-clobbered-state"

const simpleSequenceToEntitySequence = (simpleSeq) => {
  const entSeq = []
  let charsPassed = 0
  for (const seq of simpleSeq) {
    if (seq.label) {
      entSeq.push({
        text: seq.text,
        label: seq.label,
        start: charsPassed,
        end: charsPassed + seq.text.length,
      })
    }
    charsPassed += seq.text.length
  }
  return entSeq
}

const entitySequenceToSimpleSeq = (doc, entSeq) => {
  if (!entSeq) return undefined
  const simpleSeq = []
  entSeq = [...entSeq]
  entSeq.sort((a, b) => a.start - b.start)
  let nextEntity = 0
  for (let i = 0; i < doc.length; i++) {
    if ((entSeq[nextEntity] || {}).start === i) {
      simpleSeq.push({
        text: entSeq[nextEntity].text,
        label: entSeq[nextEntity].label,
      })
      i = entSeq[nextEntity].end
      nextEntity += 1
    } else {
      if (simpleSeq.length === 0 || simpleSeq[simpleSeq.length - 1].label) {
        simpleSeq.push({ text: doc[i] })
      } else {
        simpleSeq[simpleSeq.length - 1].text += doc[i]
      }
    }
  }
  return simpleSeq
}

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
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.samples.length}
      taskOutput={props.samples.map((s) => s.annotation)}
      description={
        getTaskDescription(props.samples[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={(sampleIndex) => {
        if (props.containerProps.onExit) {
          props.containerProps.onExit(
            sampleIndex > currentSampleIndex ? "go-to-next" : "go-to-previous"
          )
        } else {
          setCurrentSampleIndex(sampleIndex)
        }
      }}
    >
      <NLPAnnotator
        key={currentSampleIndex}
        type="label-sequence"
        document={props.samples[currentSampleIndex].document}
        labels={props.interface.labels || props.interface.availableLabels}
        initialSequence={initialSequence}
        onFinish={(result) => {
          props.onSaveTaskOutputItem(currentSampleIndex, {
            entities: simpleSequenceToEntitySequence(result),
          })
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default TextEntityRecognition
