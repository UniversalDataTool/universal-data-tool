// @flow

import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Divider from "@material-ui/core/Divider"
import { useLabelHelp } from "./"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  fontVariantNumeric: "tabular-nums",
})

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
const preciseUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
  minimumFractionDigits: 2,
})

const steps = ["setup", "running", "completed"]

export default () => {
  const { formula, variables } = useLabelHelp()
  const funcArgs = Object.keys(variables)
  const formulaFuncPos = new Function(...funcArgs, "return " + formula)
  const formulaFunc = (variables) => {
    return formulaFuncPos(...funcArgs.map((ak) => variables[ak]))
  }
  const totalCost = formulaFunc(variables)
  const [activeStep, setActiveStep] = useState("completed")
  return (
    <Container>
      <Stepper activeStep={steps.indexOf(activeStep)}>
        {["Setup", "Running", "Completed"].map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === "setup" ? (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Cost / Sample</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(variables).map((varName) => (
                <TableRow>
                  <TableCell style={{ textTransform: "capitalize" }}>
                    {varName.replace(/_/g, " ")}
                  </TableCell>
                  <TableCell>{variables[varName]}</TableCell>
                  <TableCell>
                    {varName === "sample_count"
                      ? ""
                      : preciseUSDFormatter.format(
                          (totalCost -
                            formulaFunc({ ...variables, [varName]: 0 })) /
                            variables.sample_count /
                            (variables[varName] === 0 ? 1 : variables[varName])
                        )}
                  </TableCell>
                  <TableCell>
                    {usdFormatter.format(
                      (totalCost -
                        formulaFunc({ ...variables, [varName]: 0 })) /
                        variables.sample_count
                    )}
                  </TableCell>
                  <TableCell>
                    {/* {varName === "sample_count"
                    ? usdFormatter.format(totalCost)
                    : ""} */}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total Cost</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{usdFormatter.format(totalCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Time to Complete</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>1-3 days</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            padding={2}
            paddingTop={4}
          >
            <Box>Credits: $132.00</Box>
            <Box flexGrow={1} />
            <Button variant="outlined">API Key</Button>
            <Button style={{ marginLeft: 12 }} variant="outlined">
              Info
            </Button>
            <Button style={{ marginLeft: 12 }} variant="outlined">
              Add Credits
            </Button>
            <Button
              style={{ marginLeft: 12 }}
              variant="outlined"
              color="primary"
            >
              Start Label Help
            </Button>
          </Box>
        </Box>
      ) : activeStep === "running" ? (
        <Box>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Percent Complete</TableCell>
                <TableCell>72%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Budget Used</TableCell>
                <TableCell>$45 / $75</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Remaining Samples</TableCell>
                <TableCell>120</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Unsynced Samples</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box display="flex" marginTop={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              style={{
                color: colors.red[500],
                border: `1px solid ${colors.red[200]}`,
              }}
            >
              Stop Early
            </Button>
            <Box flexGrow={1} />
            <Button variant="outlined" color="primary">
              Sync Samples
            </Button>
          </Box>
        </Box>
      ) : activeStep === "completed" ? (
        <Box>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Percent Complete</TableCell>
                <TableCell>100%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Cost</TableCell>
                <TableCell>$75</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Unsynced Samples</TableCell>
                <TableCell>32</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box display="flex" marginTop={2} justifyContent="flex-end">
            <Button variant="outlined">Restart</Button>
            <Button
              style={{ marginLeft: 12 }}
              variant="outlined"
              color="primary"
            >
              Sync Samples
            </Button>
          </Box>
        </Box>
      ) : null}
    </Container>
  )
}
