// @flow weak

import React from "react"
import { styled } from "@material-ui/core/styles"
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
import ConfigureImageLandmarkAnnotation from "../ConfigureImageLandmarkAnnotation"
import ConfigureTimeSeries from "../ConfigureTimeSeries"

const Container = styled("div")({
  padding: 24,
})

const NoOptions = styled("div")({
  fontSize: 18,
  textAlign: "center",
  fontWeight: "bold",
  color: colors.grey[500],
  paddingTop: 30,
  paddingBottom: 50,
})

export const ConfigureInterface = ({
  interface: iface,
  onChange,
  onClickEditJSON,
  isNested = false,
}) => {
  return (
    <Container>
      {!iface?.type && <NoOptions>Select a Type</NoOptions>}
      {iface?.type === "image_segmentation" && (
        <ConfigureImageSegmentation iface={iface} onChange={onChange} />
      )}
      {iface?.type === "image_pixel_segmentation" && (
        <ConfigureImagePixelSegmentation iface={iface} onChange={onChange} />
      )}
      {iface?.type === "image_classification" && (
        <ConfigureImageClassification iface={iface} onChange={onChange} />
      )}
      {iface?.type === "composite" && (
        <ConfigureComposite iface={iface} onChange={onChange} />
      )}
      {iface?.type === "data_entry" && (
        <ConfigureDataEntry iface={iface} onChange={onChange} />
      )}
      {iface?.type === "audio_transcription" && (
        <ConfigureAudioTranscription iface={iface} onChange={onChange} />
      )}
      {iface?.type === "text_entity_recognition" && (
        <ConfigureTextEntityRecognition iface={iface} onChange={onChange} />
      )}
      {iface?.type === "text_entity_relations" && (
        <ConfigureTextEntityRelations iface={iface} onChange={onChange} />
      )}
      {iface?.type === "text_classification" && (
        <ConfigureTextClassification iface={iface} onChange={onChange} />
      )}
      {iface?.type === "video_segmentation" && (
        <ConfigureVideoSegmentation iface={iface} onChange={onChange} />
      )}
      {iface?.type === "3d_bounding_box" && (
        <Configure3D iface={iface} onChange={onChange} />
      )}
      {iface?.type === "image_landmark_annotation" && (
        <ConfigureImageLandmarkAnnotation iface={iface} onChange={onChange} />
      )}
      {iface?.type === "time_series" && (
        <ConfigureTimeSeries iface={iface} onChange={onChange} />
      )}
    </Container>
  )
}

export default ConfigureInterface
