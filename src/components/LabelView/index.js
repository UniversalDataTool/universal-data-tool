import React, { useState } from "react"
import LabelErrorBoundary from "../LabelErrorBoundary"
import UniversalDataViewer from "../UniversalDataViewer"
import PaperContainer from "../PaperContainer"
import Stats from "../Stats"
import SampleGrid from "../SampleGrid"
import { setIn } from "seamless-immutable"
import usePosthog from "../../utils/use-posthog"
import duration from "duration"

export default ({
  dataset,
  onChangeDataset,
  singleSampleDataset,
  onChangeSingleSampleDataset,
  selectedBrush = "complete",
  onClickSetup,
  onChangeSampleTimeToComplete,
  sampleTimeToComplete,
}) => {
  const posthog = usePosthog()
  let percentComplete = 0
  if (dataset.samples && dataset.samples.length > 0) {
    percentComplete =
      dataset.samples
        .map((s) => s.annotation !== undefined && s.annotation !== null)
        .filter(Boolean).length / dataset.samples.length
  }
  return singleSampleDataset ? (
    <LabelErrorBoundary>
      <UniversalDataViewer
        datasetName={`Sample ${singleSampleDataset.sampleIndex}`}
        onSaveTaskOutputItem={(relativeIndex, output) => {
          let newDataset = dataset
          newDataset = setIn(
            newDataset,
            ["samples", singleSampleDataset.sampleIndex, "annotation"],
            output
          )

          if (
            singleSampleDataset.samples[0].brush !== selectedBrush &&
            !(
              singleSampleDataset.samples[0].brush === undefined &&
              selectedBrush === "complete"
            )
          ) {
            newDataset = setIn(
              newDataset,
              ["samples", singleSampleDataset.sampleIndex, "brush"],
              selectedBrush
            )
          }
          onChangeSingleSampleDataset(
            setIn(
              singleSampleDataset,
              ["samples", relativeIndex, "annotation"],
              output
            )
          )
          onChangeDataset(newDataset)
        }}
        onExit={(nextAction = "nothing") => {
          if (singleSampleDataset.startTime) {
            onChangeSampleTimeToComplete(
              Date.now() - singleSampleDataset.startTime
            )
          }
          const { sampleIndex } = singleSampleDataset
          switch (nextAction) {
            case "go-to-next":
              if (sampleIndex !== dataset.samples.length - 1) {
                posthog.capture("next_sample", {
                  interface_type: dataset.interface.type,
                })
                onChangeSingleSampleDataset({
                  ...dataset,
                  samples: [dataset.samples[sampleIndex + 1]],
                  sampleIndex: sampleIndex + 1,
                  startTime: Date.now(),
                })
                return
              }
              break
            case "go-to-previous":
              if (sampleIndex !== 0) {
                onChangeSingleSampleDataset({
                  ...dataset,
                  samples: [dataset.samples[sampleIndex - 1]],
                  sampleIndex: sampleIndex - 1,
                  startTime: Date.now(),
                })
                return
              }
              break
            default:
              break
          }
          onChangeSingleSampleDataset(null)
        }}
        dataset={singleSampleDataset}
        onClickSetup={() => onClickSetup}
      />
    </LabelErrorBoundary>
  ) : (
    <PaperContainer>
      <Stats
        stats={[
          {
            name: "Percent Complete",
            value: Math.floor(percentComplete * 100) + "%",
          },
          {
            name: "Time per Sample",
            value: duration(
              new Date(Date.now() - sampleTimeToComplete)
            ).toString(1, 1),
          },
          {
            name: "Estimated Remaining",
            value: duration(
              new Date(
                Date.now() -
                  sampleTimeToComplete *
                    (1 - percentComplete) *
                    (dataset.samples || []).length
              )
            ).toString(1, 2),
          },
        ]}
      />
      <SampleGrid
        count={(dataset.samples || []).length}
        samples={dataset.samples || []}
        completed={(dataset.samples || []).map((s) => Boolean(s.annotation))}
        onClick={(sampleIndex) => {
          posthog.capture("open_sample", {
            interface_type: dataset.interface.type,
          })
          onChangeSingleSampleDataset({
            ...dataset,
            samples: [dataset.samples[sampleIndex]],
            sampleIndex,
            startTime: Date.now(),
          })
        }}
      />
    </PaperContainer>
  )
}
