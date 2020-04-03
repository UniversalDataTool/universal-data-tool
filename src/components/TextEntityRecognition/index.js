import React, { useState } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"

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
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
  const initialSequence =
    props.taskOutput && props.taskOutput[currentSampleIndex]
      ? entitySequenceToSimpleSeq(
          props.taskData[currentSampleIndex].document,
          props.taskOutput[currentSampleIndex].entities
        )
      : undefined

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
        key={currentSampleIndex}
        type="label-sequence"
        document={props.taskData[currentSampleIndex].document}
        labels={props.interface.labels}
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
