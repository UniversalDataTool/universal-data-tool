// @flow

import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Header from "../Header"
import Button from "@material-ui/core/Button"
import templates from "./templates"
import * as colors from "@material-ui/core/colors"
import { useDropzone } from "react-dropzone"
import CreateFromTemplateDialog from "../CreateFromTemplateDialog"
import AddAuthFromTemplateDialog from "../AddAuthFromTemplateDialog"
import { styled } from "@material-ui/core/styles"
import usePosthog from "../../utils/use-posthog"
import packageInfo from "../../../package.json"
import useEventCallback from "use-event-callback"
import DownloadIcon from "@material-ui/icons/GetApp"

import { useTranslation } from "react-i18next"

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[900],
    height: "100vh",
  },
  headerButton: {
    fontSize: 12,
    backgroundColor: "#fff",
  },
  downloadIcon: {
    marginTop: 2,
    width: 18,
    height: 18,
    marginRight: 4,
    marginLeft: -6,
    color: colors.grey[700],
  },
})

const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
  color: "#fff",
  overflowY: "scroll",
  padding: 100,
  [theme.breakpoints.down("sm")]: {
    padding: 50,
  },
}))
const Content = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "calc(100% - 32px)",
  marginLeft: 16,
  maxWidth: 1000,
}))

const Title = styled("div")({
  marginTop: 20,
  fontSize: 36,
  fontWeight: 600,
  color: colors.grey[300],
})

const Subtitle = styled("div")({
  fontSize: 18,
  // fontWeight: "bold",
  marginTop: 8,
  color: colors.grey[500],
})
const ActionList = styled("div")({ marginTop: 48 })
const Action = styled("a")({
  display: "block",
  color: colors.blue[500],
  marginTop: 4,
  cursor: "pointer",
  textDecoration: "none",
})
const ActionTitle = styled("div")({
  // fontWeight: "bold",
  fontSize: 24,
  marginBottom: 8,
  color: colors.grey[500],
})
const ActionText = styled("div")({
  color: colors.grey[300],
  "& a": {
    cursor: "pointer",
    color: colors.blue[500],
    textDecoration: "none",
  },
})
const Actionless = styled("div")({
  color: colors.grey[600],
  paddingTop: 16,
})
const BottomSpacer = styled("div")({ height: 100 })

export default ({
  onFileDrop,
  onOpenTemplate,
  showDownloadLink = true,
  recentItems = [],
  onOpenRecentItem,
  onClickOpenSession,
}) => {
  const c = useStyles()
  const posthog = usePosthog()

  // internalization hook
  const { t, i18n } = useTranslation()

  //const isDesktop = useIsDesktop()
  const [newVersionAvailable, changeNewVersionAvailable] = useState(false)
  useEffect(() => {
    // if (!isDesktop) return
    async function checkNewVersion() {
      const newPackage = await fetch(
        "https://raw.githubusercontent.com/UniversalDataTool/universal-data-tool/master/package.json"
      ).then((r) => r.json())
      if (newPackage.version !== packageInfo.version) {
        changeNewVersionAvailable(newPackage.version)
      }
    }
    checkNewVersion()
  }, [])

  const [
    createFromTemplateDialogOpen,
    changeCreateFromTemplateDialogOpen,
  ] = useState(false)
  const [addAuthFromDialogOpen, changeAddAuthFromDialogOpen] = useState(false)
  const onDrop = useEventCallback((acceptedFiles) => {
    onFileDrop(acceptedFiles[0])
  })

  let { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className={c.container}>
      <CreateFromTemplateDialog
        open={createFromTemplateDialogOpen}
        onSelect={(template) => {
          posthog.capture("template_clicked", {
            clicked_template: template.name,
          })
          onOpenTemplate(template)
        }}
        onClose={() => changeCreateFromTemplateDialogOpen(false)}
      />
      <AddAuthFromTemplateDialog
        open={addAuthFromDialogOpen}
        onSelect={(template) => onOpenTemplate(template)}
        onClose={() => changeAddAuthFromDialogOpen(false)}
      />
      <Header
        additionalButtons={[
          newVersionAvailable && (
            <Button
              variant="outlined"
              key="download-latest"
              className={c.headerButton}
              href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
            >
              {t("Download Version")} v{newVersionAvailable}
            </Button>
          ),
          !newVersionAvailable && showDownloadLink && (
            <Button
              variant="outlined"
              key="download"
              href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
              className={c.headerButton}
            >
              {t("Download")}
            </Button>
          ),
        ].filter(Boolean)}
      />
      <ContentContainer>
        <Content>
          <Grid container>
            <Grid xs={12} item>
              <Title>Universal Data Tool</Title>
              <Subtitle>{t("Open-Source Data Labeling")}</Subtitle>
            </Grid>
            <Grid xs={6} item>
              <ActionList>
                <ActionTitle>Start</ActionTitle>
                <Action
                  onClick={() => {
                    posthog.capture("template_clicked", {
                      clicked_template: "empty",
                    })
                    onOpenTemplate(templates.find((t) => t.name === "Empty"))
                  }}
                >
                  {t("New File")}
                </Action>
                <Action
                  onClick={() => changeCreateFromTemplateDialogOpen(true)}
                >
                  {t("Start from Template")}
                </Action>
                <Action {...getRootProps()}>
                  <input {...getInputProps()} />
                  {t("Open File")}
                </Action>
                {onClickOpenSession && (
                  <Action onClick={onClickOpenSession}>
                    {t("Open Collaborative Session")}
                  </Action>
                )}
                <Action onClick={() => changeAddAuthFromDialogOpen(true)}>
                  {t("Add Authentification")}
                </Action>
                {/* <Action>Open Folder</Action> */}
              </ActionList>
              <ActionList>
                <ActionTitle>Recent</ActionTitle>
                {recentItems.length === 0 ? (
                  <Actionless>{t("No Recent Files")}</Actionless>
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
                  {t("Downloading and Installing UDT")}
                </Action>
                <Action href="https://dev.to/seveibar/make-bounding-boxes-for-artificial-intelligence-with-udt-1kai">
                  {t("Labeling Images")}
                </Action>
                {/* <Action>Custom Data Entry</Action> */}
                <Action href="https://github.com/UniversalDataTool/universal-data-tool">
                  Github {t("Repository").toUpperCase()}
                </Action>
                {/* <Action href="#">
                  How to Collaborate in Real-Time with UDT
                </Action> */}
              </ActionList>
            </Grid>
            <Grid xs={6} item>
              <ActionList>
                <ActionTitle>About</ActionTitle>
                <ActionText>
                  {t(
                    "The Universal Data Tool (UDT) is an open-source web or downloadable tool for labeling data for usage in machine learning or data processing systems."
                  )}
                  <br />
                  <br />
                  {t(
                    "The Universal Data Tool supports Computer Vision, Natural Language Processing (including Named Entity Recognition and Audio Transcription) workflows."
                  )}
                  <br />
                  <br />
                  {t("The UDT uses an")}{" "}
                  <a href="https://github.com/UniversalDataTool/udt-format">
                    open-source data format (.udt.json / .udt.csv)
                  </a>{" "}
                  {t(
                    "that can be easily read by programs as a ground-truth dataset for machine learning algorithms."
                  )}
                  <br />
                  <br />
                </ActionText>
              </ActionList>
              <ActionList>
                <ActionTitle>Instant Try Now</ActionTitle>
                <ActionText>
                  <Action
                    style={{ display: "inline" }}
                    onClick={() => changeCreateFromTemplateDialogOpen(true)}
                  >
                    {t("Open a template")}
                  </Action>{" "}
                  {t("to see how the UDT could work for your data.")}
                </ActionText>
              </ActionList>
            </Grid>
            <Grid xs={12} item>
              <BottomSpacer />
            </Grid>
          </Grid>
        </Content>
      </ContentContainer>
    </div>
  )
}
