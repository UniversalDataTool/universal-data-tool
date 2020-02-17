// @flow weak

import React from "react"
import ConfigureInterface, { Heading } from "../ConfigureInterface"
import PaperContainer from "../PaperContainer"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import useIsDesktop from "../../utils/use-is-desktop"

const Button = styled(MuiButton)({
  margin: 8
})

export default ({ oha, onChange, onClickEditJSON, onClickDownloadJSON }) => {
  const { interface: iface } = oha
  const isDesktop = useIsDesktop()
  return (
    <div>
      <ConfigureInterface
        iface={iface}
        onChange={onChange}
        onClickEditJSON={onClickEditJSON}
      />
      <PaperContainer>
        <Heading>Advanced</Heading>
        <Box padding={2}>
          <Button onClick={onClickEditJSON} variant="outlined">
            Edit JSON
          </Button>
          {!isDesktop && (
            <Button onClick={onClickDownloadJSON} variant="outlined">
              Download JSON
            </Button>
          )}
        </Box>
      </PaperContainer>
    </div>
  )
}
