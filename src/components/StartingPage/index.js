// @flow

import React, { useState, useMemo, useEffect } from "react"
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
import usePosthog from "../../utils/use-posthog"
import packageInfo from "../../../package.json"
import useIsDesktop from "../../utils/use-is-desktop"
import useEventCallback from "use-event-callback"

const useStyles = makeStyles({
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
const Action = styled("a")({
  display: "block",
  color: colors.blue[500],
  marginTop: 4,
  cursor: "pointer",
  textDecoration: "none"
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

export default ({
  onFileDrop,
  onOpenTemplate,
  showDownloadLink = true,
  recentItems = [],
  onOpenRecentItem,
  onClickOpenSession
}) => {
  const c = useStyles()
  const posthog = usePosthog()

  const isDesktop = useIsDesktop()
  const [newVersionAvailable, changeNewVersionAvailable] = useState(false)
  useEffect(() => {
    // if (!isDesktop) return
    async function checkNewVersion() {
      const newPackage = await fetch(
        "https://raw.githubusercontent.com/UniversalDataTool/universal-data-tool/master/package.json"
      ).then(r => r.json())
      if (newPackage.version !== packageInfo.version) {
        changeNewVersionAvailable(true)
      }
    }
    checkNewVersion()
  }, [])

  const [
    createFromTemplateDialogOpen,
    changeCreateFromTemplateDialogOpen
  ] = useState(false)
  const onDrop = useEventCallback(acceptedFiles => {
    onFileDrop(acceptedFiles[0])
  })

  let { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className={c.container}>
      <CreateFromTemplateDialog
        open={createFromTemplateDialogOpen}
        onSelect={template => {
          posthog.capture("template_clicked", {
            clicked_template: template.name
          })
          onOpenTemplate(template)
        }}
        onClose={() => changeCreateFromTemplateDialogOpen(false)}
      />
      <Header
        additionalButtons={[
          newVersionAvailable && (
            <Button
              key="download-latest"
              className={c.headerButton}
              href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
            >
              Out of date! Download New Version
            </Button>
          ),
          showDownloadLink && (
            <Button
              key="download"
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
                  onClick={() => {
                    posthog.capture("template_clicked", {
                      clicked_template: "empty"
                    })
                    onOpenTemplate(templates.find(t => t.name === "Empty"))
                  }}
                >
                  New File
                </Action>
                <Action
                  onClick={() => changeCreateFromTemplateDialogOpen(true)}
                >
                  Start from Template
                </Action>
                <Action {...getRootProps()}>
                  <input {...getInputProps()} />
                  Open File
                </Action>
                {onClickOpenSession && (
                  <Action onClick={onClickOpenSession}>
                    Open Collaborative Session
                  </Action>
                )}
                {/* <Action>Open Folder</Action> */}
              </ActionList>
              <ActionList>
                <ActionTitle>Recent</ActionTitle>
                {recentItems.length === 0 ? (
                  <Actionless>No Recent Files</Actionless>
                ) : (
                  recentItems.map((ri, i) => (
                    <Action key={i} onClick={() => onOpenRecentItem(ri)}>
                      {ri.fileName}
                    </Action>
                  ))
                )}
              </ActionList>
              <ActionList>
                <ActionTitle>Help</ActionTitle>
                <Action href="https://github.com/UniversalDataTool/universal-data-tool/releases">
                  Downloading and Installing UDT
                </Action>
                <Action href="https://dev.to/seveibar/make-bounding-boxes-for-artificial-intelligence-with-udt-1kai">
                  Labeling Images
                </Action>
                {/* <Action>Custom Data Entry</Action> */}
                <Action href="https://github.com/UniversalDataTool/universal-data-tool">
                  Github Repository
                </Action>
                <Action href="#">
                  How to Collaborate in Real-Time with UDT
                </Action>
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
