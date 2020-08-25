// @flow weak

import React, { useState, useEffect, useReducer } from "react"
import { styled } from "@material-ui/core/styles"
import templates, { templateMap } from "../StartingPage/templates"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import * as colors from "@material-ui/core/colors"
import ConfigureImageSegmentation from "../ConfigureImageSegmentation"
import ConfigureImagePixelSegmentation from "../ConfigureImagePixelSegmentation"
import ConfigureImageClassification from "../ConfigureImageClassification"
import ConfigureTextClassification from "../ConfigureTextClassification"
import ConfigureAudioTranscription from "../ConfigureAudioTranscription"
import ConfigureTextEntityRecognition from "../ConfigureTextEntityRecognition"
import ConfigureTextEntityRelations from "../ConfigureTextEntityRelations"
import ConfigureDataEntry from "../ConfigureDataEntry"
import ConfigureComposite from "../ConfigureComposite"
import Configure3D from "../Configure3D"
import ConfigureVideoSegmentation from "../ConfigureVideoSegmentation"
import UniversalDataViewer from "../UniversalDataViewer"
import Grid from "@material-ui/core/Grid"
import LabelErrorBoundary from "../LabelErrorBoundary"
import useEventCallback from "use-event-callback"

const noop = () => {}

const Container = styled("div")({
  padding: 24,
  "&.emptyState": {
    textAlign: "center",
    backgroundColor: colors.blue[800],
    minHeight: "70vh",
    padding: 64,
    "& .bigText": {
      textAlign: "left",
      fontSize: 48,
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 48,
    },
  },
})

const BigButton = styled(Button)({
  padding: 10,
  width: 200,
  height: 150,
  boxShadow: "0px 3px 5px rgba(0,0,0,0.3)",
  margin: 12,
  backgroundColor: "#fff",
  "& .bigIcon": {
    marginTop: 16,
    width: 64,
    height: 64,
  },
  "&:hover": {
    backgroundColor: "#fff",
  },
})

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
      key={t.dataset.interface.type || "empty"}
      className={
        currentlySelected === t.dataset.interface.type ? "selected" : ""
      }
      variant="outlined"
      onClick={() => {
        if (currentlySelected !== t.dataset.interface.type) {
          onChange(t.dataset.interface.type)
        }
      }}
    >
      <t.Icon className="icon" />
      {t.name}
    </TypeButton>
  ))
}

export const ConfigureInterface = ({
  dataset,
  onChange: onChangeProp,
  onClickEditJSON,
  isNested = false,
}) => {
  const iface = dataset.interface
  const [previewChangedTime, changePreviewChangedTime] = useState(0)
  const [previewLoading, changePreviewLoading] = useState(false)
  const [previewVersion, incPreviewVersion] = useReducer(
    (state) => state + 1,
    0
  )
  const [previewDataset, setPreviewDataset] = useState({
    interface: iface,
    samples: dataset?.samples?.length
      ? [dataset.samples[0]]
      : [templateMap[iface.type].dataset.samples[0]],
  })
  const onChange = useEventCallback((...args) => {
    changePreviewChangedTime(Date.now())
    onChangeProp(...args)
  })
  useEffect(() => {
    if (Date.now() - previewChangedTime > 1000) return
    changePreviewLoading(true)
    let timeout = setTimeout(() => {
      changePreviewLoading(false)
      incPreviewVersion()
      setPreviewDataset({
        interface: iface,
        samples: dataset?.samples?.length
          ? [dataset.samples[0]]
          : [templateMap[iface.type].dataset.samples[0]],
      })
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line
  }, [previewChangedTime])

  if (!iface.type || iface.type === "empty") {
    return (
      <Container className="emptyState">
        <div className="bigText">Choose an Interface:</div>
        {templates
          .filter((t) => t.name !== "Empty")
          .map((template) => (
            <BigButton
              key={template.name}
              onClick={() => onChange(template.dataset.interface)}
            >
              <div>
                <div>{template.name}</div>
                <div>
                  <template.Icon className="bigIcon" />
                </div>
              </div>
            </BigButton>
          ))}
      </Container>
    )
  }

  return (
    <Container>
      <Heading>Interface Type</Heading>
      <SelectType
        currentlySelected={iface.type}
        onChange={(type) => {
          onChange(
            templates
              .map((t) => t.dataset.interface)
              .find((t) => t.type === type) || {}
          )
        }}
      />
      <Grid container>
        <Grid item hidden={isNested} xs={12} lg={6}>
          <Heading>Preview</Heading>
          <PreviewContainer>
            <PreviewContent
              style={{ opacity: previewLoading ? 0.5 : 1, height: "100%" }}
            >
              <LabelErrorBoundary key={previewVersion}>
                <UniversalDataViewer
                  key={previewVersion}
                  height={600}
                  onExit={noop}
                  onSaveTaskOutputItem={noop}
                  dataset={previewDataset}
                />
              </LabelErrorBoundary>
            </PreviewContent>
          </PreviewContainer>
        </Grid>
        <Grid item xs={12} lg={isNested ? 12 : 6}>
          <Heading>Options</Heading>
          <Box paddingTop={2} />
          {!iface.type && <NoOptions>Select a Type</NoOptions>}
          {iface.type === "image_segmentation" && (
            <ConfigureImageSegmentation iface={iface} onChange={onChange} />
          )}
          {iface.type === "image_pixel_segmentation" && (
            <ConfigureImagePixelSegmentation
              iface={iface}
              onChange={onChange}
            />
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
            <ConfigureTextEntityRecognition iface={iface} onChange={onChange} />
          )}
          {iface.type === "text_entity_relations" && (
            <ConfigureTextEntityRelations iface={iface} onChange={onChange} />
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
