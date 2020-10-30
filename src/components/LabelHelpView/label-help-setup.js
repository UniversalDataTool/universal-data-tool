import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import useLabelHelp from "./use-label-help"
import usePosthog from "../../hooks/use-posthog"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useAppConfig } from "../AppConfig"
import useDataset from "../../hooks/use-dataset"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"

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

export const LabelHelpSetup = ({ onChangeActiveStep, onError }) => {
  const { fromConfig, setInConfig } = useAppConfig()

  const [dataset, setDataset] = useDataset()

  const {
    variables,
    totalCost = 0,
    formulaFunc = () => 0,
    myCredits = () => 0,
  } = useLabelHelp()

  const posthog = usePosthog()

  const [isCreating, setIsCreating] = useState(false)

  const onStartLabelHelp = useEventCallback(async () => {
    onError(null)
    setIsCreating(true)
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
      .then(async (r) => {
        if (!r.ok) {
          throw new Error(await r.text())
        }
        return r.json()
      })
      .catch((e) => {
        onError(e.toString())
        throw e
      })
    if (!response) {
      onError("Empty response from server")
      return null
    }

    setIsCreating(false)
    setDataset(
      setIn(dataset, ["labelHelp"], {
        url: response.custom_id,
        totalCost,
      })
    )

    onChangeActiveStep("running")

    posthog.capture("start_label_help_button_clicked")
  })

  return (
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
          {Object.keys(variables || {}).map((varName) => (
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
                  (totalCost - formulaFunc({ ...variables, [varName]: 0 })) /
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
          onClick={() => {
            setInConfig("labelhelp.apikey", null)
            posthog.capture("api_key_button_clicked")
          }}
          variant="outlined"
        >
          API Key
        </Button>
        <Button
          color={myCredits < totalCost ? "primary" : "none"}
          style={{ marginLeft: 12 }}
          variant="outlined"
          href="https://labelhelp.universaldatatool.com#addcredits"
          onClick={() => {
            posthog.capture("add_credits_button_clicked")
          }}
        >
          Add Credits
        </Button>
        <Button
          onClick={onStartLabelHelp}
          style={{ marginLeft: 12 }}
          variant="outlined"
          disabled={isCreating}
          color={myCredits >= totalCost ? "primary" : "none"}
        >
          {!isCreating ? "Start Label Help" : <CircularProgress size={16} />}
        </Button>
      </Box>
    </Box>
  )
}

export default LabelHelpSetup
