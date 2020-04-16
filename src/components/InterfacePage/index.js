// @flow weak

import React from "react"
import ConfigureInterface, { Heading } from "../ConfigureInterface"
import { useUpdate } from "react-use"
import usePosthog from "../../utils/use-posthog"
import PaperContainer from "../PaperContainer"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import useIsDesktop from "../../utils/use-is-desktop"

const Button = styled(MuiButton)({
  margin: 8,
})

export default ({ oha, onChange, onClickEditJSON, onClearLabelData }) => {
  const { interface: iface } = oha
  const posthog = usePosthog()
  const forceUpdate = useUpdate()
  const isDesktop = useIsDesktop()

  return (
    <div>
      <ConfigureInterface
        iface={iface}
        onChange={onChange}
        onClickEditJSON={onClickEditJSON}
        isNotNested
      />
      <PaperContainer>
        <Heading>Advanced</Heading>
        <Box padding={2}>
          <Button onClick={onClickEditJSON} variant="outlined">
            Edit JSON
          </Button>
          <Button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete all your label data? Click OK to delete."
                )
              ) {
                onClearLabelData()
              }
            }}
            variant="outlined"
          >
            Clear All Labels
          </Button>
          <Button
            onClick={onClickEditJSON}
            variant="outlined"
            onClick={() => {
              if (posthog.has_opted_out_capturing()) {
                posthog.opt_in_capturing()
              } else {
                posthog.opt_out_capturing()
              }
              forceUpdate()
            }}
          >
            {posthog.has_opted_out_capturing() ? "Enable" : "Disable"} Telemetry
          </Button>
          <Button
            onClick={onClickEditJSON}
            variant="outlined"
            onClick={() => {
              const response = window.prompt(
                "Input URL for new collaboration server (empty to use universaldatatool.com):",
                window.localStorage.getItem("CUSTOM_COLLABORATION_SERVER") || ""
              )
              if (response === null) return
              window.localStorage.setItem(
                "CUSTOM_COLLABORATION_SERVER",
                response
              )
              window.location.reload()
            }}
          >
            Custom Collaboration Server
          </Button>
        </Box>
      </PaperContainer>
    </div>
  )
}
