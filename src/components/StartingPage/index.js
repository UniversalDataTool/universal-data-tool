// @flow

import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Header from "../Header"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import templates from "./templates"
import * as colors from "@material-ui/core/colors"
import VideoIcon from "@material-ui/icons/OndemandVideo"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import TemplateIcon from "@material-ui/icons/Description"

const useStyles = makeStyles({
  title: {},
  contentTitle: {
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center"
  },
  contentSubtitle: {
    textAlign: "center",
    wordWrap: "normal",
    paddingLeft: 40,
    paddingRight: 40,
    padding: 30
  },
  bigButton: {
    width: 240,
    fontSize: 24,
    margin: 20,
    border: `1px dashed ${colors.grey[500]}`
  },
  bigButtonContent: {
    display: "flex",
    lineHeight: 1.5,
    height: 160,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  bigIcon: {
    margin: 20,
    width: 64,
    height: 64
  },
  grow: { flexGrow: 1 },
  content: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  headerButton: { color: "#fff" }
})

export default () => {
  const c = useStyles()

  return (
    <div>
      <Header
        additionalButtons={[
          <Button
            href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
            className={c.headerButton}
          >
            Download Universal Data Tool
          </Button>
        ]}
      />
      <Grid container>
        <Grid item xs={12}>
          <Typography className={c.contentTitle} variant="h3" noWrap>
            Universal Data Tool
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={c.contentSubtitle} variant="h5">
            Annotate data for Computer Vision, Natural Language Processing, Data
            Entry and More.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={c.content}>
            <Button className={c.bigButton}>
              <div className={c.bigButtonContent}>
                <div>Open File</div>
                <FileIcon className={c.bigIcon} />
              </div>
            </Button>
            <Button className={c.bigButton}>
              <div className={c.bigButtonContent}>
                <div>Create from Template</div>
                <TemplateIcon className={c.bigIcon} />
              </div>
            </Button>
            <Button className={c.bigButton}>
              <div className={c.bigButtonContent}>
                <div>Watch Tutorials</div>
                <VideoIcon className={c.bigIcon} />
              </div>
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
