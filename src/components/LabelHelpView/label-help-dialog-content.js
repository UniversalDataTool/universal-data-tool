// @flow

import React, { useState, useEffect } from "react"
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
import { useAppConfig } from "../AppConfig"
import { useLabelHelp } from "./"
import * as colors from "@material-ui/core/colors"
import { useActiveDataset } from "../FileContext"
import CircularProgress from "@material-ui/core/CircularProgress"
import { setIn } from "seamless-immutable"

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
  const { fromConfig, setInConfig } = useAppConfig()
  const {
    labelHelpEnabled,
    labelHelpError,
    loadMyCredits,
    variables,
    totalCost,
    formulaFunc,
    myCredits,
  } = useLabelHelp()
  const [error, setError] = useState()
  const { dataset, setDataset } = useActiveDataset()

  const [labelHelpInfo, setLabelHelpInfo] = useState(dataset.labelHelp || {})
  const collabUrl = labelHelpInfo.url

  useEffect(() => {
    if (myCredits === null || myCredits === undefined) {
      loadMyCredits(dataset)
    }
  }, [myCredits])

  useEffect(() => {
    if (!collabUrl) return
    const interval = setInterval(async () => {
      const response = await fetch(
        `https://labelhelp.universaldatatool.com/api/job?custom_id=${encodeURIComponent(
          collabUrl
        )}&api_key=${fromConfig("labelhelp.apikey")}`
      ).then((r) => r.json())
      // response contains { progress, status }
      setLabelHelpInfo({
        ...dataset.labelHelp,
        response,
      })
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [collabUrl])

  if (!labelHelpEnabled)
    return (
      <Container>
        Label Help is Disabled.
        {labelHelpError && (
          <div style={{ color: colors.red[500] }}>{labelHelpError}</div>
        )}
      </Container>
    )

  const activeStep = !collabUrl
    ? "setup"
    : labelHelpInfo.progress === 1
    ? "completed"
    : "running"

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
                  <TableCell></TableCell>
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
            <Box>Credits: {usdFormatter.format(myCredits)}</Box>
            <Box flexGrow={1} />
            <Button
              onClick={() => setInConfig("labelhelp.apikey", null)}
              variant="outlined"
            >
              API Key
            </Button>
            <Button
              color={myCredits < totalCost ? "primary" : "none"}
              style={{ marginLeft: 12 }}
              variant="outlined"
              href="https://labelhelp.universaldatatool.com#addcredits"
            >
              Add Credits
            </Button>
            <Button
              onClick={async () => {
                setError(null)
                const response = await fetch(
                  "https://labelhelp.universaldatatool.com/api/submit",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      dataset,
                      price: totalCost,
                      api_key: fromConfig("labelhelp.apikey"),
                    }),
                    headers: { "Content-Type": "application/json" },
                  }
                )
                  .then((r) => r.json())
                  .catch((e) => {
                    setError(e.toString())
                    return null
                  })
                if (!response) {
                  setError("Empty response from server")
                  return null
                }

                setDataset(
                  setIn(dataset, ["labelHelp"], {
                    url: response.custom_id,
                  })
                )
              }}
              style={{ marginLeft: 12 }}
              variant="outlined"
              color={myCredits >= totalCost ? "primary" : "none"}
            >
              Start Label Help
            </Button>
          </Box>
        </Box>
      ) : activeStep === "running" ? (
        <Box>
          {labelHelpInfo.loaded ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Percent Complete</TableCell>
                  <TableCell>{labelHelpInfo.progress.toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Budget Used</TableCell>
                  <TableCell>
                    ${labelHelpInfo.progress * labelHelpInfo.pice} / $75
                  </TableCell>
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
          ) : (
            <Box padding={8} textAlign="center">
              <CircularProgress size={100} />
            </Box>
          )}
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
