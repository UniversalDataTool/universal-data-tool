// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import templates from "../StartingPage/templates"
import Button from "@material-ui/core/Button"

const Container = styled("div")({
  margin: 16,
  padding: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
  boxShadow: "0px 2px 2px rgba(0,0,0,0.1)"
})

const TypeButton = styled(Button)({
  margin: 8,
  "& .icon": {
    marginRight: 4,
    color: "#888"
  },
  alignItems: "center",
  justifyContent: "center"
})

const Heading = styled("div")({
  fontSize: 18
})

const SelectType = ({ currentlySelected }) => {
  return templates.map(t => (
    <TypeButton variant="outlined">
      <t.Icon className="icon" />
      {t.name}
    </TypeButton>
  ))
}

export const ConfigureInterface = ({ iface = {} }) => {
  return (
    <Container>
      <Heading>Type</Heading>
      <SelectType />
      {/* {!iface.type && <SelectType />} */}
    </Container>
  )
}

export default ConfigureInterface
