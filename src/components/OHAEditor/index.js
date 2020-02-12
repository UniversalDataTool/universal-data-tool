// @flow

import React, { useState, useEffect } from "react"
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
import useElectron from "../../utils/use-electron"

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
  const { remote, ipcRenderer } = useElectron()

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

  return (
    <div>
      <Header
        title={
          <EditableTitleText onChange={onChangeFileName} value={fileName} />
        }
        onChangeTab={tab => changeMode(tab.toLowerCase())}
        currentTab={mode}
        tabs={["Settings", "Samples", "Label"]}
      />
      <div>
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
                sampleIndex
              })
              changeMode("label")
            }}
            openSampleInputEditor={sampleIndex => {
              changeSampleInputEditor({ open: true, sampleIndex })
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
            }}
            oha={singleSampleOHA}
          />
        ) : (
          mode === "label" && (
            <PaperContainer>
              <SampleGrid
                count={(oha.taskData || []).length}
                completed={(oha.taskOutput || []).map(Boolean)}
                onClick={sampleIndex => {
                  changeSingleSampleOHA({
                    ...oha,
                    taskData: [oha.taskData[sampleIndex]],
                    taskOutput: [(oha.taskOutput || [])[sampleIndex]],
                    sampleIndex
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
