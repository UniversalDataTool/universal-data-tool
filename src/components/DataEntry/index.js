import React from "react"
import Survey from "material-survey/components/Survey"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import useClobberedState from "../../hooks/use-clobbered-state"

export const DataEntry = (props) => {
  const [currentSampleIndex, setCurrentSampleIndex] = useClobberedState(
    props.sampleIndex,
    0
  )
  const form =
    props.samples[currentSampleIndex].surveyjs || props.interface.surveyjs
  if (!form)
    throw new Error("No survey/form created. Try adding some inputs in Setup")
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
      onChangeSample={(sampleIndex) => setCurrentSampleIndex(sampleIndex)}
    >
      <Survey
        key={(props.sampleIndex || 0) + currentSampleIndex}
        variant="flat"
        form={form}
        defaultAnswers={
          props.samples[currentSampleIndex].annotation || undefined
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
