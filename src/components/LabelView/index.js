import React, { useEffect, useState } from "react"
import LabelErrorBoundary from "../LabelErrorBoundary"
// import UniversalDataViewer from "../UniversalDataViewer"
import UniversalSampleEditor from "../UniversalSampleEditor"
import Stats from "../Stats"
import SampleGrid from "../SampleGrid"
import Box from "@material-ui/core/Box"
import usePosthog from "../../hooks/use-posthog"
import duration from "duration"
import { styled } from "@material-ui/core/styles"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle"
import DataUsageIcon from "@material-ui/icons/DataUsage"
import LabelHelpView from "../LabelHelpView"
import ActiveLearningView from "../ActiveLearningView"
import useIsLabelOnlyMode from "../../hooks/use-is-label-only-mode"
import useSummary from "../../hooks/use-summary"
import useSample from "../../hooks/use-sample"
import useRemoveSamples from "../../hooks/use-remove-samples"
import useInterface from "../../hooks/use-interface"
import useAppConfig from "../../hooks/use-app-config"

const OverviewContainer = styled("div")({
  padding: 8,
  paddingBottom: 0,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
})

export default ({
  selectedBrush = "complete",
  sampleIndex,
  onChangeSampleIndex,
  onClickSetup,
  onChangeSampleTimeToComplete,
  sampleTimeToComplete,
}) => {
  const [currentTab, setTab] = useState("label")
  const posthog = usePosthog()
  const labelOnlyMode = useIsLabelOnlyMode()
  const { fromConfig } = useAppConfig()
  const [annotationStartTime, setAnnotationStartTime] = useState(null)
  const { summary } = useSummary()
  const removeSamples = useRemoveSamples()
  const { sample, updateSample, sampleLoading } = useSample(sampleIndex)
  const { iface } = useInterface()

  const labelHelpEnabled = !fromConfig("labelhelp.disabled")
  const isInOverview = sampleIndex === null

  let percentComplete = 0
  if (summary?.samples && summary.samples.length > 0) {
    percentComplete =
      summary.samples.filter((s) => s?.hasAnnotation).length /
      summary.samples.length
  }

  useEffect(() => {
    if (labelHelpEnabled) {
      posthog.capture("label_help_showed")
    }
  }, [labelHelpEnabled, posthog])

  useEffect(() => {
    if (currentTab === "labelhelp") {
      posthog.capture("label_help_clicked")
    }
  }, [currentTab, posthog])

  return !isInOverview ? (
    <LabelErrorBoundary>
      <UniversalSampleEditor
        sampleIndex={sampleIndex}
        loading={sampleLoading}
        onRemoveSample={(sampleIndex) => {
          if (window.confirm("Are you sure you want to delete this sample?")) {
            removeSamples([summary.samples[sampleIndex]._id])
          }
        }}
        onModifySample={(newSample) => {
          updateSample({
            ...newSample,
            brush: selectedBrush,
          })
        }}
        onExit={(nextAction = "nothing") => {
          if (annotationStartTime) {
            onChangeSampleTimeToComplete(Date.now() - annotationStartTime)
          }
          switch (nextAction) {
            case "go-to-next":
              if (sampleIndex !== summary.samples.length - 1) {
                posthog.capture("next_sample", {
                  interface_type: iface?.type,
                })
                // TODO reset start time
                onChangeSampleIndex(sampleIndex + 1)
                setAnnotationStartTime(Date.now())
                return
              }
              break
            case "go-to-previous":
              if (sampleIndex !== 0) {
                onChangeSampleIndex(sampleIndex - 1)
                setAnnotationStartTime(Date.now())
                return
              }
              break
            default:
              break
          }
          onChangeSampleIndex(null)
        }}
        interface={iface}
        sample={sample}
        onClickSetup={onClickSetup}
      />
    </LabelErrorBoundary>
  ) : (
    <OverviewContainer>
      <Box display="flex">
        <Box>
          <Tabs value={currentTab} onChange={(e, newTab) => setTab(newTab)}>
            <Tab icon={<BorderColorIcon />} label="Label" value="label" />
            {!labelOnlyMode && (
              <Tab
                icon={<DataUsageIcon />}
                label="Active Learning"
                value="activelearning"
              />
            )}
            {!labelOnlyMode && (
              <Tab
                icon={<SupervisedUserCircleIcon />}
                label={"Crowd Label"}
                value="labelhelp"
              />
            )}
          </Tabs>
        </Box>
        <Box flexGrow={1} />
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
                      (summary.samples || []).length
                )
              ).toString(1, 2),
            },
          ]}
        />
      </Box>
      <Box flexGrow={1}>
        {currentTab === "label" && (
          <SampleGrid
            tablePaginationPadding={6}
            samples={summary?.samples || []}
            onClick={(selectedSampleIndex) => {
              posthog.capture("open_sample", {
                interface_type: iface?.type,
              })
              onChangeSampleIndex(selectedSampleIndex)
            }}
          />
        )}
        {currentTab === "activelearning" && <ActiveLearningView />}
        {currentTab === "labelhelp" && <LabelHelpView />}
      </Box>
    </OverviewContainer>
  )
}
