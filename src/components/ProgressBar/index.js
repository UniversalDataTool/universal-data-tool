// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  height: 36,
  width: "100%",
  boxSizing: "border-box",
  position: "relative",
  marginTop: 8,
  marginBottom: 8,
  backgroundColor: colors.blue[50],
})
const Text = styled("div")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  paddingTop: 4,
  fontSize: 18,
  textAlign: "center",
  fontWeight: "bold",
})
const Bar = styled("div")({
  position: "absolute",
  left: 0,
  bottom: 0,
  top: 0,
  backgroundColor: colors.blue[300],
})

export default ({ progress }) => {
  return (
    <Container>
      <Bar style={{ right: 100 - progress + "%" }} />
      <Text>{Math.floor(progress)}%</Text>
    </Container>
  )
}
