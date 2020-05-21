// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({})
const Stat = styled("div")({
  display: "inline-flex",
  flexDirection: "column",
  margin: 8,
})
const Label = styled("div")({
  fontSize: 14,
  fontWeight: "bold",
  color: colors.grey[700],
})
const Value = styled("div")({
  fontSize: 32,
  marginTop: 8,
})

export default ({ stats }) => {
  return (
    <Container>
      {stats.map((s) => (
        <Stat key={s.name}>
          <Label>{s.name}</Label>
          <Value>{s.value}</Value>
        </Stat>
      ))}
    </Container>
  )
}
