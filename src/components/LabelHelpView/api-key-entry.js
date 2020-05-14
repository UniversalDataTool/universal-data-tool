import React from "react"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"

const Title = styled("div")({
  fontSize: 18,
  color: colors.grey[800],
  padding: 16,
  "& a": {
    color: colors.blue[600],
  },
})

export default () => {
  return (
    <Box paddingTop={8} textAlign="center">
      <Title>
        To use Label Help, enter your API key. You can{" "}
        <a href="https://labelhelp.universaldatatool.com">
          get an API key here
        </a>
        .
      </Title>
      <Box paddingTop={2}>
        <TextField variant="outlined" label="API Key" />
        <Button
          onClick={() => {
            // TODO check with labelhelp server and make sure api key is valid
          }}
        >
          Sync
        </Button>
      </Box>
    </Box>
  )
}
