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
  fileName = "unnamed",
  onChangeFileName,
  onChangeOHA,
  initialMode = "json"
}) => {
  const c = useStyles()
  const [mode, changeMode] = useState(initialMode)
  const [jsonText, changeJSONText] = useState(defaultOHAObject)

  useEffect(() => {
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
        additionalButtons={[
          <IconButton disabled className={c.headerButton}>
            <SaveIcon className={c.saveIcon} />
          </IconButton>,
          mode === "json" ? (
            <Button
              onClick={() => changeMode("sample")}
              className={c.headerButton}
            >
              Switch to Sample Editor
              <NextIcon />
            </Button>
          ) : (
            <Button
              onClick={() => changeMode("json")}
              className={c.headerButton}
            >
              Switch to JSON Editor
              <EditIcon className={c.editIcon} />
            </Button>
          )
        ]}
      />
      <div>
        {mode === "json" ? (
          <AceEditor
            theme="github"
            mode="javascript"
            value={jsonText}
            editorProps={{ $blockScrolling: Infinity }}
            onChange={t => changeJSONText(t)}
          />
        ) : (
          <UniversalDataViewer oha={oha} />
        )}
      </div>
    </div>
  )
}
