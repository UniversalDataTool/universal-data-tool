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

export const UniversalDataViewer = ({
  oha,
  onExit,
  hideHeader,
  hideDescription,
  datasetName,
  requireCompleteToPressNext,
  onSaveTaskOutputItem,
  height,
  onClickSetup,
}) => {
  // TODO type check w/ superstruct against oha
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

  if (!oha || !oha.interface.type) {
    return (
      <BadOHA
        title="Set up your project to begin labeling"
        description={
          <p>
            This interface hasn't been set up properly, try selecting an
            interface in the "Setup" tab.
            <br />
            <br />
            <Button color="primary" variant="contained" onClick={onClickSetup}>
              Setup Project
            </Button>
          </p>
        }
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
          onExit={onExit}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
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
          onExit={onExit}
        />
      )
    case "audio_transcription":
      return (
        <AudioTranscription
          containerProps={containerProps}
          {...oha}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    default:
      return `"${oha.interface.type}" not supported`
  }
}

export default UniversalDataViewer
