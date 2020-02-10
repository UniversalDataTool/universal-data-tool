// @flow weak

import React from "react"
import ConfigureInterface, { Heading } from "../ConfigureInterface"
import PaperContainer from "../PaperContainer"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"

export default ({ oha, onChange, onClickEditJSON }) => {
  const { interface: iface } = oha
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
        </Box>
      </PaperContainer>
    </div>
  )
}
