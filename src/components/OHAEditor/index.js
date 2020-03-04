// @flow

import React, { useState, useEffect, useReducer } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import GithubIcon from "../Header/GithubIcon.js"
import Header from "../Header"
import brace from "brace"
import AceEditor from "react-ace"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"
import EditIcon from "@material-ui/icons/Edit"
import SaveIcon from "@material-ui/icons/Save"
import defaultOHAObject from "./default-oha-object"
import UniversalDataViewer from "../UniversalDataViewer"
import EditableTitleText from "./EditableTitleText.js"
import SampleDataTable from "../SampleDataTable"
import InterfacePage from "../InterfacePage"
import EditSampleDialog from "../EditSampleDialog"
import SampleGrid from "../SampleGrid"
import PaperContainer from "../PaperContainer"
import Stats from "../Stats"
import useElectron from "../../utils/use-electron"
import download from "downloadjs"
import moment from "moment"
import duration from "duration"

import "brace/mode/javascript"
import "brace/theme/github"

const useStyles = makeStyles({
  headerButton: {
    color: "#fff"
  },
  saveIcon: {
    marginRight: 4
  },
  editIcon: {
    marginLeft: 4
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh"
  }
})

export default ({
  datasetName = "Universal Data Tool",
  oha,
  content,
  fileName = "unnamed",
  onChangeFileName,
  onChangeContent = () => null,
  onChangeOHA = () => null,
  onFileDrop,
  initialMode = "settings" //= "samples"
}) => {
  const c = useStyles()
  const [mode, changeMode] = useState(initialMode)
  const [singleSampleOHA, changeSingleSampleOHA] = useState()
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const [jsonText, changeJSONText] = useState(
    JSON.stringify(content || oha || defaultOHAObject, null, "  ")
  )
  const { remote, ipcRenderer } = useElectron() || {}

  const [{ timeToCompleteSample }, changeSampleTimeToComplete] = useReducer(
    (state, newTimeToComplete) => {
      const newSamplesInWindow = state.samplesInWindow
        .slice(-10)
        .concat([newTimeToComplete])
      return {
        timeToCompleteSample:
          newSamplesInWindow.reduce((acc, a) => acc + a, 0) /
          newSamplesInWindow.length,
        samplesInWindow: newSamplesInWindow
      }
    },
    { timeToCompleteSample: 0, samplesInWindow: [] }
  )

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
    onChangeContent(jsonText)
    try {
      // schema validation etc.
      onChangeOHA(JSON.parse(jsonText))
    } catch (e) {}
  }, [jsonText])

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
          <EditableTitleText onChange={onChangeFileName} value={fileName} />
        }
        onChangeTab={tab => changeMode(tab.toLowerCase())}
        currentTab={mode}
        tabs={["Settings", "Samples", "Label"]}
      />
      <div style={{ overflowY: "scroll" }}>
        {mode === "json" && (
          <AceEditor
            theme="github"
            mode="javascript"
            width="100%"
            value={jsonText || ""}
            editorProps={{ $blockScrolling: Infinity }}
            onChange={t => changeJSONText(t)}
          />
        )}
        {mode === "settings" && (
          <InterfacePage
            onClickEditJSON={() => changeMode("json")}
            onClickDownloadJSON={() => {
              download(
                jsonText,
                fileName.includes(".") ? fileName : fileName + ".udt.json"
              )
            }}
            oha={oha}
            onChange={iface => {
              changeJSONText(
                JSON.stringify(
                  {
                    ...oha,
                    interface: iface
                  },
                  null,
                  "  "
                )
              )
            }}
          />
        )}
        {mode === "samples" && (
          <SampleDataTable
            oha={oha}
            openSampleLabelEditor={sampleIndex => {
              changeSingleSampleOHA({
                ...oha,
                taskData: [oha.taskData[sampleIndex]],
                taskOutput: [(oha.taskOutput || [])[sampleIndex]],
                sampleIndex,
                annotationStartTime: Date.now()
              })
              changeMode("label")
            }}
            openSampleInputEditor={sampleIndex => {
              changeSampleInputEditor({ open: true, sampleIndex })
            }}
            deleteSample={sampleIndex => {
              const newTaskData = [...oha.taskData]
              const newTaskOutput = oha.taskOutput
                ? [...oha.taskOutput]
                : undefined
              newTaskData.splice(sampleIndex, 1)
              if (newTaskOutput) {
                newTaskOutput.splice(sampleIndex, 1)
              }
              changeJSONText(
                JSON.stringify(
                  {
                    ...oha,
                    taskData: newTaskData,
                    taskOutput: newTaskOutput
                  },
                  null,
                  "  "
                )
              )
            }}
            onChangeOHA={newOHA => {
              changeJSONText(JSON.stringify(newOHA, null, "  "))
            }}
          />
        )}
        {mode === "label" && singleSampleOHA ? (
          <UniversalDataViewer
            datasetName={`Sample ${singleSampleOHA.sampleIndex}`}
            onSaveTaskOutputItem={(relativeIndex, output) => {
              const newOHA = { ...oha }
              if (!newOHA.taskOutput)
                newOHA.taskOutput = newOHA.taskData.map(td => null)
              newOHA.taskOutput[singleSampleOHA.sampleIndex] = output
              changeJSONText(JSON.stringify(newOHA, null, "  "))
              changeSingleSampleOHA(null)
              if (singleSampleOHA.startTime) {
                changeSampleTimeToComplete(
                  Date.now() - singleSampleOHA.startTime
                )
              }
            }}
            oha={singleSampleOHA}
          />
        ) : (
          mode === "label" && (
            <PaperContainer>
              <Stats
                stats={[
                  {
                    name: "Percent Complete",
                    value: Math.floor(percentComplete * 100) + "%"
                  },
                  {
                    name: "Time per Sample",
                    value: duration(
                      new Date(Date.now() - timeToCompleteSample)
                    ).toString(1, 1)
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
                    ).toString(1, 2)
                  }
                ]}
              />
              <SampleGrid
                count={(oha.taskData || []).length}
                completed={(oha.taskOutput || []).map(Boolean)}
                onClick={sampleIndex => {
                  changeSingleSampleOHA({
                    ...oha,
                    taskData: [oha.taskData[sampleIndex]],
                    taskOutput: [(oha.taskOutput || [])[sampleIndex]],
                    sampleIndex,
                    startTime: Date.now()
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
        onChange={newInput => {
          const newOHA = { ...oha, taskData: [...oha.taskData] }
          newOHA.taskData[sampleInputEditor.sampleIndex] = newInput
          changeJSONText(JSON.stringify(newOHA, null, "  "))
        }}
      />
    </div>
  )
}
