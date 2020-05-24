import React from "react"
import { styled } from "@material-ui/core/styles"
import APIKeyEntry from "./api-key-entry.js"
import PaperContainer from "../PaperContainer"
import LabelHelpDialogContent from "./label-help-dialog-content"
import { useAppConfig } from "../AppConfig"

export { LabelHelpProvider, LabelHelpContext } from "./LabelHelpProvider.js"
export { useLabelHelp } from "./use-label-help"

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
})

export const LabelHelpView = () => {
  const { fromConfig } = useAppConfig()
  const hasAPIKey = Boolean(fromConfig("labelhelp.apikey"))

  return (
    <Container>
      {!hasAPIKey ? (
        <APIKeyEntry key="apikeyentry" />
      ) : (
        <PaperContainer
          key="dialogcontent"
          style={{ marginTop: 48, width: "100%", maxWidth: 800 }}
        >
          <LabelHelpDialogContent />
        </PaperContainer>
      )}
    </Container>
  )
}

export default LabelHelpView
