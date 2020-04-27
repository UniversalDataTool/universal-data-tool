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
      changeJSONText(JSON.stringify(oha, null, "  "))
    }
    if (mode !== "label") {
      changeSingleSampleOHA(null)
    }
    posthog.capture("open_editor_tab", { tab: mode })
  }, [mode, posthog, changeJSONText, oha])

  useEffect(() => {
    if (!jsonText || mode !== "json") return
    try {
      // TODO schema validation etc.
      onChangeOHA(JSON.parse(jsonText))
    } catch (e) {}
  }, [jsonText, mode, onChangeOHA])

  const onChangeTab = useEventCallback((tab) => changeMode(tab.toLowerCase()))

  let percentComplete = 0
  if (
    oha.taskOutput &&
    oha.taskOutput.length > 0 &&
    oha.taskData &&
    oha.taskData.length > 0
  ) {
    percentComplete =
      oha.taskOutput.filter(Boolean).length / oha.taskData.length
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
      <div style={{ overflowY: "scroll" }}>
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
              onChangeOHA(without(oha, "taskOutput"))
            }}
            onChange={(iface) => {
              if (
                iface.type !== oha.interface.type &&
                oha.interface.type !== "empty" &&
                oha.taskOutput &&
                oha.taskOutput.some(Boolean)
              ) {
                addToast(
                  "Warning: Changing label types can cause label data issues. You might want to clear all label data.",
                  "error"
                )
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
                taskData: [oha.taskData[sampleIndex]],
                taskOutput: [(oha.taskOutput || [])[sampleIndex]],
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
              const newTaskData = [...oha.taskData]
              const newTaskOutput = oha.taskOutput
                ? [...oha.taskOutput]
                : undefined
              newTaskData.splice(sampleIndex, 1)
              if (newTaskOutput) {
                newTaskOutput.splice(sampleIndex, 1)
              }
              onChangeOHA({
                ...oha,
                taskData: newTaskData,
                taskOutput: newTaskOutput,
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
                if (!newOHA.taskOutput) {
                  newOHA = setIn(
                    newOHA,
                    ["taskOutput"],
                    (newOHA.taskData || []).map((td) => null)
                  )
                }
                if (
                  newOHA.taskOutput.length < newOHA.taskData.length ||
                  newOHA.taskOutput.includes(undefined)
                ) {
                  newOHA = setIn(
                    newOHA,
                    ["taskOutput"],
                    newOHA.taskData.map((td, tdi) =>
                      newOHA.taskOutput[tdi] === undefined
                        ? null
                        : newOHA.taskOutput[tdi]
                    )
                  )
                }
                newOHA = setIn(
                  newOHA,
                  ["taskOutput", singleSampleOHA.sampleIndex],
                  output
                )

                if (
                  singleSampleOHA.taskData[0].brush !== selectedBrush &&
                  !(
                    singleSampleOHA.taskData[0].brush === undefined &&
                    selectedBrush === "complete"
                  )
                ) {
                  newOHA = setIn(
                    newOHA,
                    ["taskData", singleSampleOHA.sampleIndex, "brush"],
                    selectedBrush
                  )
                }
                changeSingleSampleOHA(
                  setIn(singleSampleOHA, ["taskOutput", relativeIndex], output)
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
                    if (sampleIndex !== oha.taskData.length - 1) {
                      posthog.capture("next_sample", {
                        interface_type: oha.interface.type,
                      })
                      changeSingleSampleOHA({
                        ...oha,
                        taskData: [oha.taskData[sampleIndex + 1]],
                        taskOutput: [(oha.taskOutput || [])[sampleIndex + 1]],
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
                        taskData: [oha.taskData[sampleIndex - 1]],
                        taskOutput: [(oha.taskOutput || [])[sampleIndex - 1]],
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
                            (oha.taskData || []).length
                      )
                    ).toString(1, 2),
                  },
                ]}
              />
              <SampleGrid
                count={(oha.taskData || []).length}
                taskData={oha.taskData || []}
                completed={(oha.taskOutput || []).map(Boolean)}
                onClick={(sampleIndex) => {
                  posthog.capture("open_sample", {
                    interface_type: oha.interface.type,
                  })
                  changeSingleSampleOHA({
                    ...oha,
                    taskData: [oha.taskData[sampleIndex]],
                    taskOutput: [(oha.taskOutput || [])[sampleIndex]],
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
            ? oha.taskData[sampleInputEditor.sampleIndex]
            : null
        }
        onClose={() => {
          changeSampleInputEditor({ open: false })
        }}
        onChange={(newInput) => {
          onChangeOHA(
            setIn(oha, ["taskData", sampleInputEditor.sampleIndex], newInput)
          )
        }}
      />
    </div>
  )
}
