import React, { useState, useEffect } from "react"
import { Button, styled, Box, colors } from "@material-ui/core"
import packageInfo from "../../../package.json"
import useIsDesktop from "../../hooks/use-is-desktop"
import {
  ContentContainer,
  Content,
  Title,
  Subtitle,
  ActionList,
  Action,
  ActionTitle,
  ActionText,
  Actionless,
  BottomSpacer,
  useStyles,
} from "./parts"
import { useTranslation } from "react-i18next"
import getEmbedYoutubeUrl from "./get-embed-youtube-url.js"
import GetAppIcon from "@material-ui/icons/GetApp"
import PremiumWelcomeSidebarElement from "../PremiumWelcomeSidebarElement"

const Tab = styled("div")({
  fontWeight: 600,
  color: colors.grey[500],
  borderBottom: `1px solid ${colors.grey[700]}`,
  marginLeft: 8,
  fontSize: 14,
  "&:first-child": {
    marginLeft: 0,
  },
  cursor: "pointer",
  "&.active, &:hover": {
    color: colors.blue[500],
    borderBottom: `1px solid ${colors.blue[700]}`,
  },
})

export const RightSideContent = () => {
  const { t } = useTranslation()
  const c = useStyles()
  const isDesktop = useIsDesktop()
  const [tab, setTab] = useState("Premium")
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

  return (
    <div>
      <Box display="flex">
        <Tab
          onClick={() => setTab("About")}
          className={tab === "About" ? "active" : ""}
        >
          About
        </Tab>
        <Tab
          onClick={() => setTab("Premium")}
          className={tab === "Premium" ? "active" : ""}
        >
          Premium
        </Tab>
      </Box>
      {tab === "About" && (
        <>
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
          </ActionList>
        </>
      )}
      {tab === "Premium" && <PremiumWelcomeSidebarElement />}
    </div>
  )
}

export default RightSideContent
