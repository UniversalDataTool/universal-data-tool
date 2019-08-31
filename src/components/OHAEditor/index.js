// @flow

import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"

import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import GithubIcon from "../Header/GithubIcon.js"
import Header from "../Header"
import brace from "brace"
import AceEditor from "react-ace"
import defaultOHAObject from "./default-oha-object"

import "brace/mode/javascript"
import "brace/theme/github"

const useStyles = makeStyles({
  headerButton: { color: "#fff" }
})

export default ({
  datasetName = "Universal Data Tool",
  oha,
  onChangeOHA,
  initialMode = "json"
}) => {
  const c = useStyles()
  const [mode, changeMode] = useState(initialMode)
  const [jsonText, changeJSONText] = useState(defaultOHAObject)

  return (
    <div>
      <Header
        additionalButtons={[
          mode === "json" ? (
            <Button className={c.headerButton}>Edit Samples</Button>
          ) : (
            <Button className={c.headerButton}>Edit JSON</Button>
          )
        ]}
      />
      <div>
        <AceEditor
          theme="github"
          mode="javascript"
          value={jsonText}
          editorProps={{ $blockScrolling: Infinity }}
          onChange={t => changeJSONText(t)}
        />
      </div>
    </div>
  )
}
