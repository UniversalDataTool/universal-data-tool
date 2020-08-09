// @flow

import "../../i18n"
import React, { useMemo, useEffect, useState } from "react"
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
import useEventCallback from "use-event-callback"
import useClobberedState from "../../utils/use-clobbered-state"

export const UniversalDataViewer = ({
  dataset,
  onExit: onExitProp,
  hideHeader,
  hideDescription,
  disableHotkeys = false,
  datasetName,
  requireCompleteToPressNext,
  onSaveTaskOutputItem,
  sampleIndex: globalSampleIndex,
  height,
  onClickSetup,
}) => {
  // TODO type check w/ superstruct against dataset
  const { t } = useTranslation()

  const [sampleIndex, setSampleIndex] = useClobberedState(globalSampleIndex, 0)

  const onExit = useEventCallback((...args) => {
    console.log("onExit", { args, onExitProp })
    if (onExitProp) return onExitProp(...args)
    if (
      args[0] === "go-to-next" &&
      sampleIndex !== dataset.samples.length - 1
    ) {
      setSampleIndex(sampleIndex + 1)
    } else if (args[0] === "go-to-previous" && sampleIndex !== 0) {
      setSampleIndex(sampleIndex - 1)
    }
  })

  const containerProps = useMemo(
    () => ({
      hideHeader,
      hideDescription,
      datasetName,
      requireCompleteToPressNext,
      onExit,
      height,
      disableHotkeys,
    }),
    [
      hideHeader,
      hideDescription,
      requireCompleteToPressNext,
      datasetName,
      height,
      onExit,
      disableHotkeys,
    ]
  )

  if (!dataset || !dataset.interface.type) {
    return (
      <BadOHA
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

  if (!dataset.samples || dataset.samples.length === 0) {
    return <EmptySampleContainer />
  }

  switch (dataset.interface.type) {
    case "data_entry":
      return (
        <DataEntry
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "text_classification":
      return (
        <TextClassification
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          {...dataset}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
          onExit={onExit}
        />
      )
    case "text_entity_recognition":
      return (
        <TextEntityRecognition
          containerProps={containerProps}
          sampleIndex={sampleIndex}
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
          sampleIndex={sampleIndex}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "image_classification":
      return (
        <ImageClassification
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "video_segmentation":
      return (
        <VideoSegmentation
          containerProps={containerProps}
          sampleIndex={sampleIndex}
          {...dataset}
          onExit={onExit}
          onSaveTaskOutputItem={onSaveTaskOutputItem}
        />
      )
    case "composite":
      return (
        <Composite
          containerProps={containerProps}
          sampleIndex={sampleIndex}
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
          sampleIndex={sampleIndex}
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
