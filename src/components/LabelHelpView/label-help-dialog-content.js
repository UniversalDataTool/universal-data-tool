// @flow

import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import { useLabelHelp } from "./"
import * as colors from "@material-ui/core/colors"
import LabelHelpSetup from "./label-help-setup"
import LabelHelpRunning from "./label-help-running"
import LabelHelpCompleted from "./label-help-completed"

const Container = styled("div")({
  fontVariantNumeric: "tabular-nums",
})

const steps = ["setup", "running", "completed"]

export default () => {
  const [activeStep, setActiveStep] = useState("setup")

  const { labelHelpEnabled, labelHelpError } = useLabelHelp()

  const [error, setError] = useState()

  if (!labelHelpEnabled)
    return (
      <Container>
        Label Help isn't enabled, check the error below. If you can't resolve
        the error, reach out on{" "}
        <a href="https://universaldatatool.slack.com">the slack</a> for more
        help!
        {labelHelpError && (
          <div style={{ color: colors.red[500], marginTop: 24 }}>
            {labelHelpError}
          </div>
        )}
      </Container>
    )

  return (
    <Container>
      <Stepper activeStep={steps.indexOf(activeStep)}>
        {["Setup", "Running", "Completed"].map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {error && <Box color={colors.red[600]}>{error}</Box>}
      {activeStep === "setup" ? (
        <LabelHelpSetup onChangeActiveStep={setActiveStep} onError={setError} />
      ) : activeStep === "running" ? (
        <LabelHelpRunning
          onChangeActiveStep={setActiveStep}
          onError={setError}
        />
      ) : activeStep === "completed" ? (
        <LabelHelpCompleted onError={setError} />
      ) : null}
    </Container>
  )
}
