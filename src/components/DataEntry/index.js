import React, { useState } from "react"
import Survey from "material-survey/components/Survey"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"

export const DataEntry = (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
  const form =
    props.taskData[currentSampleIndex].surveyjs || props.interface.surveyjs
  if (!form)
    throw new Error(
      "No survey/form created it. Try adding some questions in Setup"
    )
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
      <Survey
        key={(props.sampleIndex || 0) + currentSampleIndex}
        variant="flat"
        form={form}
        defaultAnswers={
          props.taskOutput && props.taskOutput[currentSampleIndex]
            ? props.taskOutput[currentSampleIndex]
            : undefined
        }
        completeText="Save & Next"
        onFinish={(answers) => {
          props.onSaveTaskOutputItem(currentSampleIndex, answers)
          if (props.containerProps.onExit)
            props.containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default DataEntry
