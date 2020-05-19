import React, { createContext, useContext, useMemo, useState } from "react"
import { styled } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import APIKeyEntry from "./api-key-entry.js"
import PaperContainer from "../PaperContainer"
import LabelHelpDialogContent from "./label-help-dialog-content"
import useIsLabelOnlyMode from "../../utils/use-is-label-only-mode"
import { useActiveDataset } from "../FileContext"
import { useAppConfig } from "../AppConfig"
import computeDatasetVariable from "../../utils/compute-dataset-variable"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

export const LabelHelpContext = createContext({})

export const LabelHelpProvider = ({ children }) => {
  const { fromConfig } = useAppConfig()
  const [loadingPricingConfig, setLoadingPricingConfig] = useState(false)
  const [pricingConfig, setPricingConfig] = useState(false)
  const [myCredits, setMyCredits] = useState(null)
  const [remoteFile, setRemoteFile] = useState(null)
  const contextValue = useMemo(
    () => ({
      pricingConfig,
      loadPricingConfig: async () => {
        if (loadingPricingConfig) return
        setLoadingPricingConfig(true)
        const pricingConfig = await fetch(
          "https://labelhelp.universaldatatool.com/api/price"
        ).then((r) => r.json())
        setLoadingPricingConfig(false)
        setPricingConfig(pricingConfig)
      },
      loadMyCreditsAndRemoteFile: async () => {
        const apiKey = fromConfig("labelhelp.apikey")
        if (!apiKey) throw new Error("No api key")
        const { credit, jobs } = await fetch(
          `https://labelhelp.universaldatatool.com/api/me`,
          {
            headers: { apikey: apiKey },
          }
        ).then((r) => r.json())
      },
    }),
    [pricingConfig, loadingPricingConfig]
  )
  return (
    <LabelHelpContext.Provider value={contextValue}>
      {children}
    </LabelHelpContext.Provider>
  )
}

export const useLabelHelp = () => {
  const isLabelOnlyMode = useIsLabelOnlyMode()
  const { dataset } = useActiveDataset()
  const {
    pricingConfig,
    myCredits,
    loadPricingConfig,
    loadMyCredits,
  } = useContext(LabelHelpContext)
  const { fromConfig } = useAppConfig()
  if (fromConfig("labelhelp.disabled"))
    return { labelHelpEnabled: false, labelHelpError: "Disabled in config" }
  try {
    const hasLabelHelpAPIKey = Boolean(fromConfig("labelhelp.apikey"))
    if (isLabelOnlyMode) return { labelHelpEnabled: false }
    if (!hasLabelHelpAPIKey && dataset.samples.length < 100)
      return {
        labelHelpEnabled: false,
        labelHelpError: "Less than 100 samples",
      }

    if (!pricingConfig) {
      loadPricingConfig()
      return {
        labelHelpEnabled: false,
        labelHelpError: "No pricing config",
      }
    }

    if (myCredits === undefined || myCredits === null) {
      loadMyCredits()
      return {
        labelHelpEnabled: false,
        labelHelpError: "Credits not loaded",
      }
    }

    const { formula, variables: variableDescriptions } =
      pricingConfig[dataset.interface.type] || {}
    if (!formula)
      return {
        labelHelpEnabled: false,
        labelHelpError: `No pricing formula for "${dataset.interface.type}"`,
      }

    const variables = {}
    for (const variableName of Object.keys(variableDescriptions)) {
      variables[variableName] = computeDatasetVariable(dataset, variableName)
    }

    const funcArgs = Object.keys(variables)
    // TODO sanitize formula
    // eslint-disable-next-line
    const formulaFuncPos = new Function(...funcArgs, "return " + formula)
    const formulaFunc = (variables) => {
      return formulaFuncPos(...funcArgs.map((ak) => variables[ak]))
    }
    const totalCost = formulaFunc(variables)

    return {
      labelHelpEnabled: true,
      myCredits,
      formula,
      variableDescriptions,
      variables,
      formulaFunc,
      totalCost,
      labelHelpAPIKey: fromConfig("labelhelp.apikey"),
    }
  } catch (e) {
    return { labelHelpEnabled: false, labelHelpError: e.toString() }
  }
}

export const LabelHelpView = () => {
  const { fromConfig } = useAppConfig()
  const hasAPIKey = Boolean(fromConfig("labelhelp.apikey"))
  return (
    <Container>
      {!hasAPIKey ? (
        <APIKeyEntry />
      ) : (
        <PaperContainer style={{ marginTop: 48, width: "100%", maxWidth: 800 }}>
          <LabelHelpDialogContent />
        </PaperContainer>
      )}
    </Container>
  )
}

export default LabelHelpView
