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
  initialMode = "samples"
}) => {
  const c = useStyles()
  const [mode, changeMode] = useState(initialMode)
  const [singleSampleOHA, changeSingleSampleOHA] = useState()
  const [sampleInputEditor, changeSampleInputEditor] = useState({})
  const [jsonText, changeJSONText] = useState(
    content || oha || defaultOHAObject
  )

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
          <>
            {(mode === "json" ? "JSON Editor" : "Sample Editor") + " - "}
            <EditableTitleText onChange={onChangeFileName} value={fileName} />
          </>
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
            value={jsonText}
            editorProps={{ $blockScrolling: Infinity }}
            onChange={t => changeJSONText(t)}
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
          />
        )}
        {mode === "label" && (
          <UniversalDataViewer
            datasetName={`Sample ${singleSampleOHA.sampleIndex}`}
            onSaveTaskOutputItem={(relativeIndex, output) => {
              const newOHA = { ...oha }
              if (!newOHA.taskOutput)
                newOHA.taskOutput = newOHA.taskData.map(td => null)
              newOHA.taskOutput[singleSampleOHA.sampleIndex] = output
              changeJSONText(JSON.stringify(newOHA, null, "  "))
            }}
            oha={singleSampleOHA}
          />
        )}
      </div>
    </div>
  )
}
