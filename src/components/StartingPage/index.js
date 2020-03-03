// @flow

import React, { useState, useMemo } from "react"
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
import { useDropzone } from "react-dropzone"
import CreateFromTemplateDialog from "../CreateFromTemplateDialog"
import { styled } from "@material-ui/core/styles"

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
  headerButton: { color: "#fff" },
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  }
})

const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
  backgroundColor: colors.grey[900],
  color: "#fff",
  padding: 100,
  [theme.breakpoints.down("sm")]: {
    padding: 50
  },
  paddingBottom: 20
}))
const Content = styled("div")({
  display: "inline-flex",
  flexDirection: "column",
  width: "calc(100% - 32px)",
  marginLeft: 16,
  maxWidth: 1000
})

const Title = styled("div")({
  marginTop: 20,
  fontSize: 36,
  fontWeight: 600,
  color: colors.grey[300]
})

const Subtitle = styled("div")({
  fontSize: 18,
  // fontWeight: "bold",
  marginTop: 8,
  color: colors.grey[500]
})
const ActionList = styled("div")({ marginTop: 48 })
const Action = styled("div")({
  color: colors.blue[500],
  marginTop: 4,
  cursor: "pointer"
})
const ActionTitle = styled("div")({
  // fontWeight: "bold",
  fontSize: 24,
  marginBottom: 8,
  color: colors.grey[500]
})
const ActionText = styled("div")({
  color: colors.grey[300],
  "& a": {
    cursor: "pointer",
    color: colors.blue[500],
    textDecoration: "none"
  }
})
const Actionless = styled("div")({
  color: colors.grey[600],
  paddingTop: 16
})

export default ({ onFileDrop, onOpenTemplate, showDownloadLink = true }) => {
  const c = useStyles()
  const [
    createFromTemplateDialogOpen,
    changeCreateFromTemplateDialogOpen
  ] = useState(false)
  const onDrop = useMemo(() => {
    return acceptedFiles => {
      onFileDrop(acceptedFiles[0])
    }
  }, [onFileDrop])
  let { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className={c.container}>
      <CreateFromTemplateDialog
        open={createFromTemplateDialogOpen}
        onSelect={template => onOpenTemplate(template)}
        onClose={() => changeCreateFromTemplateDialogOpen(false)}
      />
      <Header
        additionalButtons={[
          showDownloadLink && (
            <Button
              href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
              className={c.headerButton}
            >
              Download
            </Button>
          )
        ].filter(Boolean)}
      />
      <ContentContainer>
        <Content>
          <Grid container>
            <Grid xs={12} item>
              <Title>Universal Data Tool</Title>
              <Subtitle>Open-Source Data Labeling</Subtitle>
            </Grid>
            <Grid xs={6} item>
              <ActionList>
                <ActionTitle>Start</ActionTitle>
                <Action
                  onClick={() =>
                    onOpenTemplate(templates.find(t => t.name === "Empty"))
                  }
                >
                  New File
                </Action>
                <Action
                  onClick={() => changeCreateFromTemplateDialogOpen(true)}
                >
                  Start from Template
                </Action>
                <Action>Open File</Action>
                <Action>Open Folder</Action>
              </ActionList>
              <ActionList>
                <ActionTitle>Recent</ActionTitle>
                <Actionless>No Recent Files</Actionless>
              </ActionList>
              <ActionList>
                <ActionTitle>Help</ActionTitle>
                <Action>Downloading and Installing UDT</Action>
                <Action>Labeling Images</Action>
                <Action>Custom Data Entry</Action>
                <Action>Github Repository</Action>
              </ActionList>
            </Grid>
            <Grid xs={6} item>
              <ActionList>
                <ActionTitle>About</ActionTitle>
                <ActionText>
                  The Universal Data Tool (UDT) is an open-source web or
                  downloadable tool for labeling data for usage in machine
                  learning or data processing systems.
                  <br />
                  <br />
                  The Universal Data Tool supports Computer Vision, Natural
                  Language Processing (including Named Entity Recognition and
                  Audio Transcription) workflows.
                  <br />
                  <br />
                  The UDT uses an{" "}
                  <a href="https://github.com/UniversalDataTool/udt-format">
                    open-source data format (.udt.json)
                  </a>{" "}
                  that can be easily read by programs as a ground-truth dataset
                  for machine learning algorithms.
                  <br />
                  <br />
                </ActionText>
              </ActionList>
              <ActionList>
                <ActionTitle>Instant Try Now</ActionTitle>
                <ActionText>
                  <a onClick={() => changeCreateFromTemplateDialogOpen(true)}>
                    Open a template
                  </a>{" "}
                  to see how the UDT could work for your data.
                </ActionText>
              </ActionList>
            </Grid>
          </Grid>
        </Content>
      </ContentContainer>
    </div>
  )
}
