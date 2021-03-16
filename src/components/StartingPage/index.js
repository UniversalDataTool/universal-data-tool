// @flow

import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { HeaderWithContainer } from "../Header"
import templates from "./templates"
import * as colors from "@material-ui/core/colors"
import { useDropzone } from "react-dropzone"
import CreateFromTemplateDialog from "../CreateFromTemplateDialog"
import AddAuthFromTemplateDialog from "../AddAuthFromTemplateDialog"
import { styled } from "@material-ui/core/styles"
import usePosthog from "../../hooks/use-posthog"
import packageInfo from "../../../package.json"
import useEventCallback from "use-event-callback"
import Box from "@material-ui/core/Box"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import getEmbedYoutubeUrl from "./get-embed-youtube-url.js"
import packageJSON from "../../../package.json"
import Button from "@material-ui/core/Button"
import GetAppIcon from "@material-ui/icons/GetApp"
import useIsDesktop from "../../hooks/use-is-desktop"

const useStyles = makeStyles((theme) => ({
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
  languageSelectionWrapper: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  languageSelectionBox: {
    display: "flex",
    paddingTop: 24,
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}))

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

const languageSelectionFormStyle = {
  input: (base) => ({
    ...base,
    color: "#e0e0e0",
  }),
  control: (base, state) => ({
    ...base,
    border: "1px solid #9e9e9e",
    background: "transparent",
    color: "#e0e0e0",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    margin: 0,
    color: "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
}

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

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
  { label: "汉语", value: "cn" },
  { label: "Português", value: "pt" },
  { label: "Néerlandais", value: "nl" },
]

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

  const isDesktop = useIsDesktop()
  // eslint-disable-next-line
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

  const [latestCommunityUpdate, setLatestCommunityUpdate] = useState(null)
  useEffect(() => {
    async function getLatestREADME() {
      const readme = await fetch(
        "https://raw.githubusercontent.com/UniversalDataTool/universal-data-tool/master/README.md"
      ).then((r) => r.text())
      const startCU = readme.search("COMMUNITY-UPDATE:START")
      const endCU = readme.search("COMMUNITY-UPDATE:END")
      const communityUpdates = readme
        .slice(startCU, endCU)
        .split("\n")
        .slice(1, -1)
        .filter((line) => line.trim() !== "")
      const latestYtLink = communityUpdates[0].match(/\((.*)\)/)[1]
      setLatestCommunityUpdate({
        name: communityUpdates[0].match(/\[(.*)\]/)[1],
        ytLink: latestYtLink,
        embedYTLink: getEmbedYoutubeUrl(latestYtLink),
      })
    }
    getLatestREADME()
  }, [])

  const [
    createFromTemplateDialogOpen,
    changeCreateFromTemplateDialogOpen,
  ] = useState(false)
  const [addAuthFromDialogOpen, changeAddAuthFromDialogOpen] = useState(false)
  const onDrop = useEventCallback((acceptedFiles) => {
    onFileDrop(acceptedFiles[0])
  })

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  let { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className={c.container}>
      <HeaderWithContainer>
        <ContentContainer>
          <Content>
            <Grid container>
              <Grid xs={12} sm={6} item>
                <Title>Universal Data Tool</Title>
                <Subtitle>{t("universaldatatool-description")}</Subtitle>
                <Subtitle>v{packageJSON.version}</Subtitle>
              </Grid>
              <Grid xs={12} sm={6} item>
                <Box className={c.languageSelectionBox}>
                  <Box
                    width="100%"
                    maxWidth={200}
                    className={c.languageSelectionWrapper}
                  >
                    <Select
                      id="language-list"
                      styles={languageSelectionFormStyle}
                      defaultValue={languageOptions.filter(
                        (lang) => lang.value === i18n.language
                      )}
                      options={languageOptions}
                      onChange={({ value }) => changeLanguage(value)}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} item>
                <ActionList>
                  <ActionTitle>{t("start")}</ActionTitle>
                  <Action
                    onClick={() => {
                      posthog.capture("template_clicked", {
                        clicked_template: "empty",
                      })
                      onOpenTemplate(templates.find((t) => t.name === "Empty"))
                    }}
                  >
                    {t("new-file")}
                  </Action>
                  <Action
                    onClick={() => changeCreateFromTemplateDialogOpen(true)}
                  >
                    {t("start-from-template")}
                  </Action>
                  <Action {...getRootProps()}>
                    <input {...getInputProps()} />
                    {t("open-file")}
                  </Action>
                  {onClickOpenSession && (
                    <Action onClick={onClickOpenSession}>
                      {t("open-collaborative-session")}
                    </Action>
                  )}
                  <Action onClick={() => changeAddAuthFromDialogOpen(true)}>
                    {t("add-authentication")}
                  </Action>
                  <Action
                    onClick={() => {
                      window.location.href =
                        "https://universaldatatool.com/courses"
                    }}
                  >
                    {t("create-training-course")}
                  </Action>
                  {/* <Action>Open Folder</Action> */}
                </ActionList>
                <ActionList>
                  <ActionTitle>{t("recent")}</ActionTitle>
                  {recentItems.length === 0 ? (
                    <Actionless>{t("no-recent-files")}</Actionless>
                  ) : (
                    recentItems.map((ri, i) => (
                      <Action key={i} onClick={() => onOpenRecentItem(ri)}>
                        {ri.fileName}
                      </Action>
                    ))
                  )}
                </ActionList>
                <ActionList>
                  <ActionTitle>{t("help")}</ActionTitle>
                  <Action href="https://github.com/UniversalDataTool/universal-data-tool/releases">
                    {t("downloading-and-installing-udt")}
                  </Action>
                  <Action href="https://dev.to/seveibar/make-bounding-boxes-for-artificial-intelligence-with-udt-1kai">
                    {t("labeling-images")}
                  </Action>
                  {/* <Action>Custom Data Entry</Action> */}
                  <Action href="https://github.com/UniversalDataTool/universal-data-tool">
                    {t("github-repository")}
                  </Action>
                  <Action href="https://www.youtube.com/channel/UCgFkrRN7CLt7_iTa2WDjf2g">
                    {t("youtube-channel")}
                  </Action>

                  {/* <Action href="#">
                  How to Collaborate in Real-Time with UDT
                </Action> */}
                </ActionList>
              </Grid>
              <Grid xs={12} sm={6} item>
                {newVersionAvailable && isDesktop && (
                  <Button
                    variant="outlined"
                    key="download-latest"
                    className={c.headerButton}
                    href="https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
                  >
                    <GetAppIcon className={c.downloadIcon} />
                    {t("Download Version")} v{newVersionAvailable}
                  </Button>
                )}
                <ActionList>
                  <ActionTitle>{t("about")}</ActionTitle>
                  <ActionText>
                    {t("start-page-about-first-paragraph")}
                    <br />
                    <br />
                    {t("start-page-about-second-paragraph")}
                    <br />
                    <br />
                    {t("the-udt-uses-an")}{" "}
                    <a href="https://github.com/UniversalDataTool/udt-format">
                      open-source data format (.udt.json / .udt.csv)
                    </a>{" "}
                    {t("start-page-about-third-paragraph")}
                    <br />
                    <br />
                  </ActionText>
                </ActionList>
                <ActionList>
                  {latestCommunityUpdate && (
                    <>
                      <ActionTitle>{latestCommunityUpdate.name}</ActionTitle>
                      <iframe
                        title={latestCommunityUpdate.name}
                        width="320"
                        height="178"
                        // src="https://www.youtube.com/embed/QW-s4XVK3Ok"
                        src={latestCommunityUpdate.embedYTLink}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </>
                  )}
                  {/* <ActionText>
                  <Action
                    style={{ display: "inline" }}
                    onClick={() => changeCreateFromTemplateDialogOpen(true)}
                  >
                    {t("open-a-template")}
                  </Action>{" "}
                  {t("to-see-how-the-udt-could-work-for-your-data")}
                </ActionText> */}
                </ActionList>
              </Grid>
              <Grid xs={12} sm={6} item>
                <BottomSpacer />
              </Grid>
            </Grid>
          </Content>
        </ContentContainer>
      </HeaderWithContainer>
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
    </div>
  )
}
