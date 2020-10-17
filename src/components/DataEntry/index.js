import React from "react"
import Survey from "material-survey/components/Survey"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"

export const DataEntry = ({
  containerProps,
  interface: iface,
  sample,
  sampleIndex,
  onModifySample,
}) => {
  const form = sample.surveyjs || iface.surveyjs
  if (!form)
    throw new Error("No survey/form created. Try adding some inputs in Setup")
  return (
    <SampleContainer
      {...containerProps}
      currentSampleIndex={sampleIndex}
      taskOutput={sample?.annotation}
      description={getTaskDescription(sample) || iface?.description}
    >
      <Survey
        key={sampleIndex}
        variant="flat"
        form={form}
        defaultAnswers={sample.annotation || undefined}
        completeText="Save & Next"
        onFinish={(answers) => {
          onModifySample({ ...sample, annotation: answers })
          containerProps.onExit("go-to-next")
        }}
      />
    </SampleContainer>
  )
}

export default DataEntry
