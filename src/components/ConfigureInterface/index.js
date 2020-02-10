// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
import templates from "../StartingPage/templates"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import * as colors from "@material-ui/core/colors"
import ConfigureImageSegmentation from "../ConfigureImageSegmentation"

const Container = styled("div")({
  margin: 16,
  padding: 16,
  border: "1px solid #ccc",
  borderRadius: 4,
  boxShadow: "0px 2px 2px rgba(0,0,0,0.1)"
})

const NoOptions = styled("div")({
  fontSize: 18,
  textAlign: "center",
  fontWeight: "bold",
  color: colors.grey[500],
  paddingTop: 30,
  paddingBottom: 50
})

const TypeButton = styled(Button)({
  margin: 8,
  "& .icon": {
    marginRight: 8,
    color: "#888"
  },
  alignItems: "center",
  justifyContent: "center",
  "&.selected": {
    backgroundColor: colors.blue[500],
    color: "#fff",
    "& .icon": {
      color: "#fff"
    }
  }
})

const Heading = styled("div")({
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: 12,
  paddingLeft: 8,
  marginBottom: 8,
  marginTop: 16,
  color: colors.grey[700]
})

const SelectType = ({ currentlySelected, onChange }) => {
  return templates.map(t => (
    <TypeButton
      key={t.oha.interface.type}
      className={currentlySelected === t.oha.interface.type ? "selected" : ""}
      variant="outlined"
      onClick={() => onChange(t.oha.interface.type)}
    >
      <t.Icon className="icon" />
      {t.name}
    </TypeButton>
  ))
}

export const ConfigureInterface = ({
  iface = {},
  onChange,
  onClickEditJSON
}) => {
  return (
    <Container>
      <Heading>Type</Heading>
      <SelectType
        currentlySelected={iface.type}
        onChange={type => {
          onChange({ ...iface, type })
        }}
      />
      <Heading>Options</Heading>
      <Box paddingTop={2} />
      {!iface.type && <NoOptions>Select a Type</NoOptions>}
      {iface.type === "image_segmentation" && (
        <ConfigureImageSegmentation iface={iface} onChange={onChange} />
      )}
      {iface.type === "composite" && (
        <NoOptions>GUI Configuration Not Available</NoOptions>
      )}
      {iface.type === "data_entry" && (
        <NoOptions>GUI Configuration Not Available</NoOptions>
      )}
      {iface.type === "audio_transcription" && (
        <NoOptions>GUI Configuration Not Available</NoOptions>
      )}
      {iface.type === "text_classification" && (
        <NoOptions>GUI Configuration Not Available</NoOptions>
      )}
      <Heading>Advanced</Heading>
      <Box padding={2}>
        <Button onClick={onClickEditJSON} variant="outlined">
          Edit JSON
        </Button>
      </Box>
    </Container>
  )
}

export default ConfigureInterface
