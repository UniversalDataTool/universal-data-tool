// @flow weak

import React, { useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import templates, { templateMap } from "../StartingPage/templates"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import * as colors from "@material-ui/core/colors"
import ConfigureImageSegmentation from "../ConfigureImageSegmentation"
import ConfigureImageClassification from "../ConfigureImageClassification"
import ConfigureTextClassification from "../ConfigureTextClassification"
import PaperContainer from "../PaperContainer"
import ConfigureAudioTranscription from "../ConfigureAudioTranscription"
import ConfigureNLP from "../ConfigureNLP"
import ConfigureDataEntry from "../ConfigureDataEntry"
import ConfigureComposite from "../ConfigureComposite"
import Configure3D from "../Configure3D"
import ConfigureVideoSegmentation from "../ConfigureVideoSegmentation"
import UniversalDataViewer from "../UniversalDataViewer"
import { setIn } from "seamless-immutable"
import Grid from "@material-ui/core/Grid"
import LabelErrorBoundary from "../LabelErrorBoundary"
import useEventCallback from "use-event-callback"
import CircularProgress from "@material-ui/core/CircularProgress"

const noop = () => {}

const Container = styled("div")({ padding: 24 })

const NoOptions = styled("div")({
  fontSize: 18,
  textAlign: "center",
  fontWeight: "bold",
  color: colors.grey[500],
  paddingTop: 30,
  paddingBottom: 50,
})

const TypeButton = styled(Button)({
  margin: 8,
  "& .icon": {
    marginRight: 8,
    color: "#888",
  },
  alignItems: "center",
  justifyContent: "center",
  "&.selected": {
    backgroundColor: colors.blue[500],
    color: "#fff",
    "& .icon": {
      color: "#fff",
    },
  },
})

export const Heading = styled("div")({
  fontWeight: "bold",
  textTransform: "uppercase",
  fontSize: 12,
  paddingLeft: 8,
  marginBottom: 8,
  marginTop: 16,
  color: colors.grey[700],
})

const PreviewContainer = styled("div")({
  display: "flex",
  justifyContent: "space-around",
  mouseEvents: "none",
  padding: 16,
})
const PreviewContent = styled("div")({
  display: "flex",
  width: "100%",
  height: 600,
})

const SelectType = ({ currentlySelected, onChange }) => {
  return templates.map((t) => (
    <TypeButton
      key={t.oha.interface.type || "empty"}
      className={currentlySelected === t.oha.interface.type ? "selected" : ""}
      variant="outlined"
      onClick={() => {
        if (currentlySelected !== t.oha.interface.type) {
          onChange(t.oha.interface.type)
        }
      }}
    >
      <t.Icon className="icon" />
      {t.name}
    </TypeButton>
  ))
}

export const ConfigureInterface = ({
  iface = {},
  onChange: onChangeProp,
  onClickEditJSON,
  isNested = false,
}) => {
  const [previewChangedTime, changePreviewChangedTime] = useState(0)
  const [previewLoading, changePreviewLoading] = useState(false)
  const [previewVersion, changePreviewVersion] = useState(0)
  const onChange = useEventCallback((...args) => {
    changePreviewChangedTime(Date.now())
    onChangeProp(...args)
  })
  useEffect(() => {
    if (Date.now() - previewChangedTime > 1000) return
    changePreviewLoading(true)
    let timeout = setTimeout(() => {
      changePreviewLoading(false)
      changePreviewVersion(previewVersion + 1)
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [previewChangedTime])
  return (
    <Container>
      <Heading>Interface Type</Heading>
      <SelectType
        currentlySelected={iface.type}
        onChange={(type) => {
          onChange(
            templates
              .map((t) => t.oha.interface)
              .find((t) => t.type === type) || {}
          )
          // onChange(setIn(iface, ["type"], type))
        }}
      />
      <Grid container>
        <Grid item hidden={isNested} xs={12} md={6}>
          <Heading>Preview</Heading>
          <PreviewContainer>
            <PreviewContent style={{ opacity: previewLoading ? 0.5 : 1 }}>
              <LabelErrorBoundary key={previewVersion}>
                <UniversalDataViewer
                  key={previewVersion}
                  height={600}
                  onExit={noop}
                  onSaveTaskOutputItem={noop}
                  oha={{
                    interface: iface,
                    samples: [templateMap[iface.type].oha.samples[0]],
                  }}
                />
              </LabelErrorBoundary>
            </PreviewContent>
          </PreviewContainer>
        </Grid>
        <Grid item xs={12} md={isNested ? 12 : 6}>
          <Heading>Options</Heading>
          <Box paddingTop={2} />
          {!iface.type && <NoOptions>Select a Type</NoOptions>}
          {iface.type === "image_segmentation" && (
            <ConfigureImageSegmentation iface={iface} onChange={onChange} />
          )}
          {iface.type === "image_classification" && (
            <ConfigureImageClassification iface={iface} onChange={onChange} />
          )}
          {iface.type === "composite" && (
            <ConfigureComposite iface={iface} onChange={onChange} />
          )}
          {iface.type === "data_entry" && (
            <ConfigureDataEntry iface={iface} onChange={onChange} />
          )}
          {iface.type === "audio_transcription" && (
            <ConfigureAudioTranscription iface={iface} onChange={onChange} />
          )}
          {iface.type === "text_entity_recognition" && (
            <ConfigureNLP iface={iface} onChange={onChange} />
          )}
          {iface.type === "text_classification" && (
            <ConfigureTextClassification iface={iface} onChange={onChange} />
          )}
          {iface.type === "video_segmentation" && (
            <ConfigureVideoSegmentation iface={iface} onChange={onChange} />
          )}
          {iface.type === "3d_bounding_box" && (
            <Configure3D iface={iface} onChange={onChange} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default ConfigureInterface
