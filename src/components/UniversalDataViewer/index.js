// @flow

import React, { useMemo } from "react"
import TextClassification from "../TextClassification"
import TextEntityRecognition from "../TextEntityRecognition"
import ImageSegmentation from "../ImageSegmentation"
import ImageClassification from "../ImageClassification"
import VideoSegmentation from "../VideoSegmentation"
import AudioTranscription from "../AudioTranscription"
import DataEntry from "../DataEntry"
import EmptySampleContainer from "../EmptySampleContainer"
import Composite from "../Composite"
import BadOHA from "../BadOHA"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"

export const UniversalDataViewer = ({
  dataset,
  onExit,
  hideHeader,
  hideDescription,
  datasetName,
  requireCompleteToPressNext,
  onSaveTaskOutputItem,
  height,
  onClickSetup,
}) => {
  // TODO type check w/ superstruct against dataset
  const { t, i18n } = useTranslation()
  const containerProps = useMemo(
    () => ({
      hideHeader,
      hideDescription,
      datasetName,
      requireCompleteToPressNext,
      onExit,
      height,
    }),
    [
      hideHeader,
      hideDescription,
      requireCompleteToPressNext,
      datasetName,
      height,
      onExit,
    ]
  )

  if (!dataset || !dataset.interface.type) {
    return (
      <BadOHA
        title="Set up your project to begin labeling"
        description={
          <p>
            {t("This interface hasn't been set up properly, try selecting an interface in the 'Setup' tab.")}
            <br />
            <br />
            <Button color="primary" variant="contained" onClick={onClickSetup}>
              {t("Setup Project")}
            </Button>
          </p>
        }
      />
    )
  }

  if (!dataset.samples || dataset.samples.length === 0) {
    return <EmptySampleContainer />
  }

  switch (dataset.interface.type) {
    case "data_entry":
      return (
        <DataEntry
          containerProps={containerProps}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "image_segmentation":
    case "image_pixel_segmentation":
      return (
        <ImageSegmentation
          containerProps={containerProps}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "image_classification":
      return (
        <ImageClassification
          containerProps={containerProps}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "video_segmentation":
      return (
        <VideoSegmentation
          containerProps={containerProps}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "composite":
      return (
        <Composite
          containerProps={containerProps}
          {...dataset}
          dataset={dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "audio_transcription":
      return (
        <AudioTranscription
          containerProps={containerProps}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    default:
      return `"${dataset.interface.type}" not supported`
  }
}

export default UniversalDataViewer
