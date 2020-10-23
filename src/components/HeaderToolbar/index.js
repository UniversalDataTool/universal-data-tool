// @flow weak

import React, { memo } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import MenuIcon from "@material-ui/icons/Menu"
import CollaborateButton from "../CollaborateButton"
import DownloadButton from "../DownloadButton"
import InfoButton from "../InfoButton"
import Button from "@material-ui/core/Button"
import GithubIcon from "../Header/GithubIcon"
import IconButton from "@material-ui/core/IconButton"
import packageJSON from "../../../package.json"
import BrushButton from "../BrushButton"
import useAuth from "../../utils/auth-handlers/use-auth.js"
import SlackIcon from "./SlackIcon"
import GitHubButton from "react-github-btn"
import { useTranslation } from "react-i18next"

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const useStyles = makeStyles((theme) => ({
  headerButton: {
    marginLeft: 16,
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300,
  },
  tab: {
    color: "#000",
    "& .icon": {},
  },
  fullHeightTab: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("sm")]: {
      minWidth: 20,
    },
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textTransform: "none",
    color: "#000",
    "&&& svg": {
      marginBottom: 0,
      marginRight: 8,
      width: 18,
      height: 18,
    },
  },
}))

const getIcon = (t) => {
  switch (t) {
    case "Setup":
      return <SettingsIcon className="icon" />
    case "Label":
      return <BorderColorIcon className="icon" />
    case "Samples":
      return <StorageIcon className="icon" />
    default:
      return <div></div>
  }
}

const HeaderToolbar = ({
  tabs,
  currentTab,
  onChangeTab,
  additionalButtons,
  onOpenDrawer,
  title = "Universal Data Tool",
  interfaceType,
  isDesktop,
  fileOpen,
  sessionBoxOpen,
  changeSessionBoxOpen,
  inSession,
  onCreateSession,
  onLeaveSession,
  onJoinSession,
  onDownload,
  selectedBrush,
  onChangeSelectedBrush,
  isSmall,
  authConfig,
  changeLoginDrawerOpen,
  collaborateError,
  isWelcomePage,
}) => {
  const c = useStyles()
  const { authProvider, isLoggedIn, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <AppBar color="default" position="static">
      <Toolbar variant="dense">
        {!isDesktop && (
          <IconButton onClick={onOpenDrawer} className={c.headerButton}>
            <MenuIcon />
          </IconButton>
        )}
        {fileOpen ? title : "Universal Data Tool v" + packageJSON.version}
        {fileOpen && <InfoButton />}
        <CollaborateButton
          sessionBoxOpen={sessionBoxOpen}
          changeSessionBoxOpen={changeSessionBoxOpen}
          fileOpen={fileOpen}
          inSession={inSession}
          onCreateSession={onCreateSession}
          onLeaveSession={onLeaveSession}
          onJoinSession={onJoinSession}
          error={collaborateError}
        />
        {fileOpen && (
          <BrushButton
            selectedBrush={selectedBrush}
            onChangeSelectedBrush={onChangeSelectedBrush}
          />
        )}
        {!isDesktop && fileOpen && (
          <DownloadButton
            interfaceType={interfaceType}
            onDownload={onDownload}
          />
        )}
        <div className={c.grow} />
        {additionalButtons}
        {tabs.length > 0 && (
          <Tabs
            onChange={(e, newTab) => onChangeTab(newTab.toLowerCase())}
            value={currentTab}
          >
            {tabs.map((t) => (
              <Tab
                key={t}
                classes={{ root: c.fullHeightTab, wrapper: c.tabWrapper }}
                className={c.tab}
                icon={getIcon(t)}
                label={isSmall ? "" : t}
                value={t.toLowerCase()}
              />
            ))}
          </Tabs>
        )}
        {authProvider !== "none" && isWelcomePage && !isLoggedIn && (
          <Button
            onClick={() => {
              changeLoginDrawerOpen(true)
            }}
            className={c.headerButton}
          >
            {t("login-with")} {capitalize(authProvider)}
          </Button>
        )}
        {isLoggedIn && (
          <Button onClick={logout} className={c.headerButton}>
            {t("logout")}
          </Button>
        )}
        {!isSmall && !isWelcomePage && (
          <IconButton
            href="https://github.com/UniversalDataTool/universal-data-tool"
            className={c.headerButton}
          >
            <GithubIcon />
          </IconButton>
        )}
        {!isSmall && isWelcomePage && (
          <Box paddingTop="4px" paddingLeft="8px">
            <GitHubButton
              href="https://github.com/UniversalDataTool/universal-data-tool"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star UniversalDataTool/universal-data-tool on GitHub"
            >
              {t("star")}
            </GitHubButton>
          </Box>
        )}
        {!isSmall && isWelcomePage && (
          <IconButton
            href="https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g"
            className={c.headerButton}
          >
            <SlackIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default memo(HeaderToolbar)
