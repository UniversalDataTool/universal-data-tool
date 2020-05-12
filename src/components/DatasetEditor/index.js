// @flow

import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Header from "../Header"
import AceEditor from "react-ace"
import UniversalDataViewer from "../UniversalDataViewer"
import EditableTitleText from "./EditableTitleText.js"
import SamplesView from "../SamplesView"
import InterfacePage from "../InterfacePage"
import EditSampleDialog from "../EditSampleDialog"
import SampleGrid from "../SampleGrid"
import PaperContainer from "../PaperContainer"
import Stats from "../Stats"
import useElectron from "../../utils/use-electron"
import duration from "duration"
import useTimeToCompleteSample from "../../utils/use-time-to-complete-sample.js"
import TextField from "@material-ui/core/TextField"
import { useToasts } from "../Toasts"
import { setIn, without } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import LabelErrorBoundary from "../LabelErrorBoundary"
import usePosthog from "../../utils/use-posthog"
import classnames from "classnames"

import "brace/mode/javascript"
import "brace/theme/github"

const useStyles = makeStyles({
  headerButton: {
    color: "#fff",
  },
  saveIcon: {
    marginRight: 4,
  },
  editIcon: {
    marginLeft: 4,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
  },
})

const headerTabs = ["Setup", "Samples", "Label"]

export default ({
  file,
  datasetName = "Universal Data Tool",
  dataset,
  content,
  inSession,
  url,
  fileName = "unnamed",
  onChangeDataset = () => null,
  onChangeFile,
  onFileDrop,
  initialMode = "setup",
  authConfig,
  user,
  recentItems,
  selectedBrush = "complete",
}) => {
  var [valueDisplay, setValueDisplay] = useState(fileName)
  const c = useStyles()
  const { addToast } = useToasts()
  const [mode, changeMode] = useState(initialMode)
  const [singleSampleDataset, changeSingleSampleDataset] = useState()
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const [jsonText, changeJSONText] = useState()
  const { ipcRenderer } = useElectron() || {}
  const posthog = usePosthog()

  const [
    timeToCompleteSample,
    changeSampleTimeToComplete,
  ] = useTimeToCompleteSample()

  useEffect(() => {
    if (!ipcRenderer) return
    const onOpenSettingsPage = () => changeMode("settings")
    const onOpenSamplesPage = () => changeMode("samples")
    const onOpenLabelPage = () => changeMode("label")
    ipcRenderer.on("open-settings-page", onOpenSettingsPage)
    ipcRenderer.on("open-samples-page", onOpenSamplesPage)
    ipcRenderer.on("open-label-page", onOpenLabelPage)
    return () => {
      ipcRenderer.removeListener("open-settings-page", onOpenSettingsPage)
      ipcRenderer.removeListener("open-samples-page", onOpenSamplesPage)
      ipcRenderer.removeListener("open-label-page", onOpenLabelPage)
    }
  }, [ipcRenderer])

  useEffect(() => {
    if (mode === "json") {
      changeJSONText(JSON.stringify(dataset, null, "  "))
    }
    if (mode !== "label") {
      changeSingleSampleDataset(null)
    }
    posthog.capture("open_editor_tab", { tab: mode })
  }, [mode, posthog, changeJSONText, dataset])

  useEffect(() => {
    if (!jsonText || mode !== "json") return
    try {
      // TODO schema validation etc.
      onChangeDataset(JSON.parse(jsonText))
    } catch (e) {}
  }, [jsonText, mode, onChangeDataset])

  const onChangeTab = useEventCallback((tab) => changeMode(tab.toLowerCase()))

  let percentComplete = 0
  if (dataset.samples && dataset.samples.length > 0) {
    percentComplete =
      dataset.samples
        .map((s) => s.annotation !== undefined && s.annotation !== null)
        .filter(Boolean).length / dataset.samples.length
  }

  return (
    <div className={classnames(c.container, "universaldatatool")}>
      <Header
        title={
          inSession ? (
            <TextField
              label="Share Link"
              value={url}
              variant="outlined"
              size="small"
            />
          ) : (
            <EditableTitleText
              label="File Name"
              onChange={(newName) => {
                onChangeFile(setIn(file, ["fileName"], newName))
                setValueDisplay(newName)
              }}
              value={valueDisplay || ""}
            />
          )
        }
        onChangeTab={onChangeTab}
        currentTab={mode}
        tabs={headerTabs}
      />
      <div style={{ height: "100%", overflowY: "scroll" }}>
        {mode === "json" && (
          <AceEditor
            theme="github"
            mode="javascript"
            width="100%"
            value={jsonText || ""}
            editorProps={{ $blockScrolling: Infinity }}
            onChange={(t) => changeJSONText(t)}
          />
        )}
        {mode === "setup" && (
          <InterfacePage
            onClickEditJSON={() => changeMode("json")}
            dataset={dataset}
            onClearLabelData={() => {
              onChangeDataset(
                setIn(
                  dataset,
                  ["samples"],
                  dataset.samples.map((s) => without(s, "annotation"))
                )
              )
            }}
            onChange={(iface) => {
              if (
                iface.type !== dataset.interface.type &&
                dataset.interface.type !== "empty" &&
                dataset.samples.map((s) => s.annotation).some(Boolean)
              ) {
                addToast(
                  "Changing label types can cause label data issues. You must clear all label data first.",
                  "error"
                )
                return
              }
              onChangeDataset({
                ...dataset,
                interface: iface,
              })
            }}
          />
        )}
        {mode === "samples" && (
          <SamplesView
            file={file}
            dataset={dataset}
            openSampleLabelEditor={(sampleIndex) => {
              changeSingleSampleDataset({
                ...dataset,
                samples: [dataset.samples[sampleIndex]],
                sampleIndex,
                annotationStartTime: Date.now(),
              })
              posthog.capture("open_sample", {
                interface_type: dataset.interface.type,
              })
              changeMode("label")
            }}
            openSampleInputEditor={(sampleIndex) => {
              changeSampleInputEditor({ open: true, sampleIndex })
            }}
            deleteSample={(sampleIndex) => {
              const newSamples = [...dataset.samples]
              newSamples.splice(sampleIndex, 1)
              onChangeDataset({
                ...dataset,
                samples: newSamples,
              })
            }}
            onChangeFile={(file) => {
              onChangeFile(file)
              setValueDisplay(file.fileName)
            }}
            onChangeDataset={onChangeDataset}
            authConfig={authConfig}
            user={user}
          />
        )}
        {mode === "label" && singleSampleDataset ? (
          <LabelErrorBoundary>
            <UniversalDataViewer
              datasetName={`Sample ${singleSampleDataset.sampleIndex}`}
              onSaveTaskOutputItem={(relativeIndex, output) => {
                let newOHA = dataset
                newOHA = setIn(
                  newOHA,
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
                  newOHA = setIn(
                    newOHA,
                    ["samples", singleSampleDataset.sampleIndex, "brush"],
                    selectedBrush
                  )
                }
                changeSingleSampleDataset(
                  setIn(
                    singleSampleDataset,
                    ["samples", relativeIndex, "annotation"],
                    output
                  )
                )
                onChangeDataset(newOHA)
              }}
              onExit={(nextAction = "nothing") => {
                if (singleSampleDataset.startTime) {
                  changeSampleTimeToComplete(
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
                      changeSingleSampleDataset({
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
                      changeSingleSampleDataset({
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
                changeSingleSampleDataset(null)
              }}
              dataset={singleSampleDataset}
              onClickSetup={() => changeMode("setup")}
            />
          </LabelErrorBoundary>
        ) : (
          mode === "label" && (
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
                      new Date(Date.now() - timeToCompleteSample)
                    ).toString(1, 1),
                  },
                  {
                    name: "Estimated Remaining",
                    value: duration(
                      new Date(
                        Date.now() -
                          timeToCompleteSample *
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
                completed={(dataset.samples || []).map((s) =>
                  Boolean(s.annotation)
                )}
                onClick={(sampleIndex) => {
                  posthog.capture("open_sample", {
                    interface_type: dataset.interface.type,
                  })
                  changeSingleSampleDataset({
                    ...dataset,
                    samples: [dataset.samples[sampleIndex]],
                    sampleIndex,
                    startTime: Date.now(),
                  })
                }}
              />
            </PaperContainer>
          )
        )}
      </div>
      <EditSampleDialog
        {...sampleInputEditor}
        sampleInput={
          sampleInputEditor.sampleIndex !== undefined
            ? dataset.samples[sampleInputEditor.sampleIndex]
            : null
        }
        onClose={() => {
          changeSampleInputEditor({ open: false })
        }}
        onChange={(newInput) => {
          onChangeDataset(
            setIn(dataset, ["samples", sampleInputEditor.sampleIndex], newInput)
          )
        }}
      />
    </div>
  )
}
