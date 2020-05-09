// @flow

import React, { useState, useEffect, useReducer } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Header from "../Header"
import AceEditor from "react-ace"
import isEmpty from "../../utils/isEmpty"
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
  oha,
  content,
  inSession,
  url,
  fileName = "unnamed",
  onChangeOHA = () => null,
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
  const [singleSampleOHA, changeSingleSampleOHA] = useState()
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const [jsonText, changeJSONText] = useState()
  const { remote, ipcRenderer } = useElectron() || {}
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
  }, [])

  useEffect(() => {
    if (mode === "json") {
      changeJSONText(JSON.stringify(oha, null, "  "))
    }
    if (mode !== "label") {
      changeSingleSampleOHA(null)
    }
    posthog.capture("open_editor_tab", { tab: mode })
  }, [mode])

  useEffect(() => {
    if (!jsonText || mode !== "json") return
    try {
      // TODO schema validation etc.
      onChangeOHA(JSON.parse(jsonText))
    } catch (e) {}
  }, [jsonText])

  const onChangeTab = useEventCallback((tab) => changeMode(tab.toLowerCase()))

  let percentComplete = 0
  if (oha.samples && oha.samples.length > 0) {
    percentComplete =
      oha.samples
        .map((s) => s.annotation !== undefined && s.annotation !== null)
        .filter(Boolean).length / oha.samples.length
  }

  return (
    <div className={c.container}>
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
            oha={oha}
            onClearLabelData={() => {
              onChangeOHA(
                setIn(
                  oha,
                  ["samples"],
                  oha.samples.map((s) => without(s, "annotation"))
                )
              )
            }}
            onChange={(iface) => {
              if (
                iface.type !== oha.interface.type &&
                oha.interface.type !== "empty" &&
                oha.samples.map((s) => s.annotation).some(Boolean)
              ) {
                addToast(
                  "Changing label types can cause label data issues. You must clear all label data first.",
                  "error"
                )
                return
              }
              onChangeOHA({
                ...oha,
                interface: iface,
              })
            }}
          />
        )}
        {mode === "samples" && (
          <SamplesView
            file={file}
            oha={oha}
            openSampleLabelEditor={(sampleIndex) => {
              changeSingleSampleOHA({
                ...oha,
                samples: [oha.samples[sampleIndex]],
                sampleIndex,
                annotationStartTime: Date.now(),
              })
              posthog.capture("open_sample", {
                interface_type: oha.interface.type,
              })
              changeMode("label")
            }}
            openSampleInputEditor={(sampleIndex) => {
              changeSampleInputEditor({ open: true, sampleIndex })
            }}
            deleteSample={(sampleIndex) => {
              const newSamples = [...oha.samples]
              newSamples.splice(sampleIndex, 1)
              onChangeOHA({
                ...oha,
                samples: newSamples,
              })
            }}
            onChangeFile={(file) => {
              onChangeFile(file)
              setValueDisplay(file.fileName)
            }}
            onChangeOHA={onChangeOHA}
            authConfig={authConfig}
            user={user}
          />
        )}
        {mode === "label" && singleSampleOHA ? (
          <LabelErrorBoundary>
            <UniversalDataViewer
              datasetName={`Sample ${singleSampleOHA.sampleIndex}`}
              onSaveTaskOutputItem={(relativeIndex, output) => {
                let newOHA = oha
                newOHA = setIn(
                  newOHA,
                  ["samples", singleSampleOHA.sampleIndex, "annotation"],
                  output
                )

                if (
                  singleSampleOHA.samples[0].brush !== selectedBrush &&
                  !(
                    singleSampleOHA.samples[0].brush === undefined &&
                    selectedBrush === "complete"
                  )
                ) {
                  newOHA = setIn(
                    newOHA,
                    ["samples", singleSampleOHA.sampleIndex, "brush"],
                    selectedBrush
                  )
                }
                changeSingleSampleOHA(
                  setIn(
                    singleSampleOHA,
                    ["samples", relativeIndex, "annotation"],
                    output
                  )
                )
                onChangeOHA(newOHA)
              }}
              onExit={(nextAction = "nothing") => {
                if (singleSampleOHA.startTime) {
                  changeSampleTimeToComplete(
                    Date.now() - singleSampleOHA.startTime
                  )
                }
                const { sampleIndex } = singleSampleOHA
                switch (nextAction) {
                  case "go-to-next":
                    if (sampleIndex !== oha.samples.length - 1) {
                      posthog.capture("next_sample", {
                        interface_type: oha.interface.type,
                      })
                      changeSingleSampleOHA({
                        ...oha,
                        samples: [oha.samples[sampleIndex + 1]],
                        sampleIndex: sampleIndex + 1,
                        startTime: Date.now(),
                      })
                      return
                    }
                    break
                  case "go-to-previous":
                    if (sampleIndex !== 0) {
                      changeSingleSampleOHA({
                        ...oha,
                        samples: [oha.samples[sampleIndex - 1]],
                        sampleIndex: sampleIndex - 1,
                        startTime: Date.now(),
                      })
                      return
                    }
                    break
                  default:
                    break
                }
                changeSingleSampleOHA(null)
              }}
              oha={singleSampleOHA}
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
                            (oha.samples || []).length
                      )
                    ).toString(1, 2),
                  },
                ]}
              />
              <SampleGrid
                count={(oha.samples || []).length}
                samples={oha.samples || []}
                completed={(oha.samples || []).map((s) =>
                  Boolean(s.annotation)
                )}
                onClick={(sampleIndex) => {
                  posthog.capture("open_sample", {
                    interface_type: oha.interface.type,
                  })
                  changeSingleSampleOHA({
                    ...oha,
                    samples: [oha.samples[sampleIndex]],
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
            ? oha.samples[sampleInputEditor.sampleIndex]
            : null
        }
        onClose={() => {
          changeSampleInputEditor({ open: false })
        }}
        onChange={(newInput) => {
          onChangeOHA(
            setIn(oha, ["samples", sampleInputEditor.sampleIndex], newInput)
          )
        }}
      />
    </div>
  )
}
