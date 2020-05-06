import React, { useState } from "react"
import getTaskDescription from "../../utils/get-task-description.js"
import SampleContainer from "../SampleContainer"
import UniversalDataViewer from "../UniversalDataViewer"
import Button from "@material-ui/core/Button"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import InterfaceIcon from "../InterfaceIcon"
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight"
import Checkbox from "@material-ui/core/Checkbox"
import Box from "@material-ui/core/Box"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"

const Title = styled("div")({
  fontSize: 18,
  fontWeight: "bold",
  color: colors.grey[700],
  borderBottom: `1px solid ${colors.grey[300]}`,
  paddingBottom: 8,
  marginBottom: 8,
  paddingLeft: 8,
})
const StyledButton = styled(Button)({
  display: "flex",
  textAlign: "left",
  justifyContent: "flex-start",
  marginTop: 8,
})

export const Composite = (props) => {
  const [currentSampleIndex, changeCurrentSampleIndex] = useState(0)
  const {
    interface: { fields },
  } = props
  const [selectedField, changeSelectedField] = useState()

  if (!fields) throw new Error("No fields defined. Try adding a field in Setup")

  const sample = props.samples[currentSampleIndex]

  if (selectedField) {
    return (
      <UniversalDataViewer
        oha={{
          interface: selectedField.interface,
          samples: [
            {
              ...sample,
              annotation: (sample.annotation || {})[selectedField.fieldName],
            },
          ],
        }}
        onSaveTaskOutputItem={(indexZero, output) => {
          props.onSaveTaskOutputItem(currentSampleIndex, {
            ...sample.annotation,
            [selectedField.fieldName]: output,
          })
          changeSelectedField(null)
        }}
      />
    )
  }

  return (
    <SampleContainer
      {...props.containerProps}
      currentSampleIndex={currentSampleIndex}
      totalSamples={props.samples.length}
      taskOutput={props.samples.map((s) => s.annotation)}
      description={getTaskDescription(sample) || props.interface.description}
      onChangeSample={(sampleIndex) => changeCurrentSampleIndex(sampleIndex)}
    >
      <Title>Fields</Title>
      {fields.map((field, index) => (
        <StyledButton
          key={field.fieldName}
          onClick={() => {
            changeSelectedField({ ...field, index })
          }}
          fullWidth
          variant="outlined"
        >
          <InterfaceIcon
            style={{ color: colors.grey[500], marginRight: 16 }}
            type={field.interface.type}
          />
          {field.fieldName}
          <Box flexGrow={1} />
          <Checkbox
            checked={Boolean((sample.annotation || {})[field.fieldName])}
          />
          <KeyboardArrowRightIcon />
        </StyledButton>
      ))}
      <StyledButton
        onClick={() => props.containerProps.onExit("go-to-next")}
        fullWidth
        variant="outlined"
      >
        <KeyboardArrowRightIcon
          style={{ color: colors.grey[500], marginRight: 16 }}
        />
        Next
        <Box flexGrow={1} />
        <Box height="42px" />
        <KeyboardArrowRightIcon />
      </StyledButton>
    </SampleContainer>
  )
}

export default Composite
