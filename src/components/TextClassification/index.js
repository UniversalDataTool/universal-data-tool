import React, { useState, useEffect, useRef } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator"
import * as datasetHelper from "../../utils/dataset-helper"

export const TextClassification = (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
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
  
    const [textToShow, changeTextToShow] = useState("")
    const oldText = useRef()
    useEffect(() =>{
      if(oldText.current !== textToShow){
        datasetHelper.getTextfromSample(props.samples[currentSampleIndex]).then((result) => {
          changeTextToShow(result)
        })
        oldText.current= textToShow
      }  
    },[props.samples,currentSampleIndex,textToShow])
  
  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.samples.length}
      taskOutput={props.samples}
      description={
        getTaskDescription(props.samples[currentSampleIndex]) ||
        props.interface.description
      }
      onChangeSample={(sampleIndex) => changeCurrentSampleIndex(sampleIndex)}
    >
      <NLPAnnotator
        key={(props.sampleIndex || 0) + currentSampleIndex}
        type="label-document"
        labels={labels}
        multipleLabels={props.interface.multiple}
        document={textToShow}
        initialLabels={initialLabels}
        onFinish={(result) => {
          props.onSaveTaskOutputItem(currentSampleIndex, result)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default TextClassification
