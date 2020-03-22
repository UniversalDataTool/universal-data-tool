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

export const UniversalDataViewer = ({
  oha,
  onExit,
  hideHeader,
  hideDescription,
  datasetName,
  requireCompleteToPressNext,
  onSaveTaskOutputItem
}) => {
  // TODO type check w/ superstruct against oha
  const containerProps = useMemo(
    () => ({
      hideHeader,
      hideDescription,
      datasetName,
      requireCompleteToPressNext,
      onExit
    }),
    [
      hideHeader,
      hideDescription,
      requireCompleteToPressNext,
      datasetName,
      onExit
    ]
  )

  if (!oha) {
    return (
      <BadOHA
        title="Null OHA"
        description="Your OHA file isn't defined for some reason."
      />
    )
  }

  if (!oha.taskData || oha.taskData.length === 0) {
    return <EmptySampleContainer />
  }

  switch (oha.interface.type) {
    case "data_entry":
      return (
        <DataEntry
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "image_segmentation":
      return (
        <ImageSegmentation
          containerProps={containerProps}
          {...oha}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "image_classification":
      return (
        <ImageClassification
          containerProps={containerProps}
          {...oha}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "video_segmentation":
      return (
        <VideoSegmentation
          containerProps={containerProps}
          {...oha}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "composite":
      return (
        <Composite
          containerProps={containerProps}
          {...oha}
          oha={oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "audio_transcription":
      return (
        <AudioTranscription
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    default:
      return `"${oha.interface.type}" not supported`
  }
}

export default UniversalDataViewer
