// @flow

import "../../i18n"
import React, { useMemo } from "react"
import TextClassification from "../TextClassification"
import TextEntityRecognition from "../TextEntityRecognition"
import TextEntityRelations from "../TextEntityRelations"
import ImageSegmentation from "../ImageSegmentation"
import ImageClassification from "../ImageClassification"
import VideoSegmentation from "../VideoSegmentation"
import AudioTranscription from "../AudioTranscription"
import ImageLandmarkAnnotation from "../ImageLandmarkAnnotation"
import TimeSeries from "../TimeSeries"
import DataEntry from "../DataEntry"
import EmptySampleContainer from "../EmptySampleContainer"
import Composite from "../Composite"
import BadDataset from "../BadDataset"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"

export const UniversalSampleEditor = ({
  interface: iface,
  sample,
  onExit,
  loading,
  onRemoveSample,
  hideHeader,
  hideHeaderText,
  hideNext,
  hidePrev,
  hideDescription,
  disableHotkeys = false,
  title,
  sampleIndex,
  onModifySample,
  height,
  onClickSetup,
}) => {
  // TODO type check w/ superstruct against dataset
  const { t } = useTranslation()

  const containerProps = useMemo(
    () => ({
      hideHeader,
      hideHeaderText,
      hideNext,
      hidePrev,
      hideDescription,
      title,
      onExit,
      onRemoveSample,
      height,
      disableHotkeys,
      globalSampleIndex: sampleIndex,
    }),
    [
      hideHeader,
      hideHeaderText,
      hideNext,
      hidePrev,
      hideDescription,
      title,
      height,
      onExit,
      disableHotkeys,
      onRemoveSample,
      sampleIndex,
    ]
  )

  if (loading) {
    return <BadDataset title="Loading Sample..." description="" />
  }

  if (!iface?.type) {
    return (
      <BadDataset
        title="Set up your project to begin labeling"
        description={
          <p>
            {t("universal-data-viewer-interface-warning")}
            <br />
            <br />
            <Button color="primary" variant="contained" onClick={onClickSetup}>
              {t("setup-project")}
            </Button>
          </p>
        }
      />
    )
  }

  if (!sample) {
    return <EmptySampleContainer />
  }

  switch (iface?.type) {
    case "data_entry":
      return (
        <DataEntry
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "text_entity_relations":
      return (
        <TextEntityRelations
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "image_segmentation":
    case "image_pixel_segmentation":
      return (
        <ImageSegmentation
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onExit={onExit}
          onModifySample={onModifySample}
        />
      )
    case "image_classification":
      return (
        <ImageClassification
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onExit={onExit}
          onModifySample={onModifySample}
        />
      )
    case "video_segmentation":
      return (
        <VideoSegmentation
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onExit={onExit}
          onModifySample={onModifySample}
        />
      )
    case "composite":
      return (
        <Composite
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "audio_transcription":
      return (
        <AudioTranscription
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "image_landmark_annotation":
      return (
        <ImageLandmarkAnnotation
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    case "time_series":
      return (
        <TimeSeries
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          interface={iface}
          sample={sample}
          onModifySample={onModifySample}
          onExit={onExit}
        />
      )
    default:
      return `"${iface?.type}" not supported`
  }
}

export default UniversalSampleEditor
