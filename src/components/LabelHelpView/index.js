import React, { createContext, useContext, useMemo, useState } from "react"
import { styled } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import APIKeyEntry from "./api-key-entry.js"
import PaperContainer from "../PaperContainer"
import LabelHelpDialogContent from "./label-help-dialog-content"
import useIsLabelOnlyMode from "../../utils/use-is-label-only-mode"
import { useFileContext } from "../FileContext"
import { useAppConfig } from "../AppConfig"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

export const LabelHelpContext = createContext({})

export const LabelHelpProvider = ({ children }) => {
  const [loadingPricingConfig, setLoadingPricingConfig] = useState(false)
  const [pricingConfig, setPricingConfig] = useState(false)
  const contextValue = useMemo(
    () => ({
      pricingConfig,
      loadPricingConfig: async () => {
        if (loadingPricingConfig) return
        setLoadingPricingConfig(true)
        // TODO get pricing config via fetch

        setLoadingPricingConfig(false)
        setPricingConfig({})
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
  return { labelHelpEnabled: false }
  // const isLabelOnlyMode = useIsLabelOnlyMode()
  // const { file } = useFileContext()
  // const { pricingConfig, loadPricingConfig } = useContext(LabelHelpContext)
  // const { fromConfig } = useAppConfig()
  // if (fromConfig("labelhelp.disabled")) return { labelHelpEnabled: false }
  // try {
  //   const hasLabelHelpAPIKey = Boolean(fromConfig("labelhelp.apikey"))
  //   if (isLabelOnlyMode) return { labelHelpEnabled: false }
  //   if (!hasLabelHelpAPIKey && file.content.samples.length < 100)
  //     return { labelHelpEnabled: false }
  //
  //   if (!pricingConfig) {
  //     loadPricingConfig()
  //     return { labelHelpEnabled: false }
  //   }
  //
  //   const { formula } = pricingConfig[file.content.interface.type]
  //
  //   return {
  //     labelHelpEnabled: true,
  //     formula,
  //     variables: {
  //       number_of_fields: 3,
  //       text_field_count: 5,
  //       total_labels: 20,
  //       total_bounding_boxes: 0,
  //       sample_count: 1000,
  //     },
  //     price: 104,
  //     labelHelpAPIKey: fromConfig("labelhelp.apikey"),
  //   }
  // } catch (e) {
  //   return { labelHelpEnabled: false }
  // }
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
