// @flow weak

import React, { memo } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { makeStyles } from "@material-ui/core/styles"
import SettingsIcon from "@material-ui/icons/Settings"
import AppsIcon from "@material-ui/icons/Apps"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import CollaborateButton from "../CollaborateButton"
import InfoButton from "../InfoButton"
import Button from "@material-ui/core/Button"
import GithubIcon from "../Header/GithubIcon"
import IconButton from "@material-ui/core/IconButton"
import BrushButton from "../BrushButton"
import useAuth from "../../utils/auth-handlers/use-auth.js"
import SlackIcon from "./SlackIcon"
import { useTranslation } from "react-i18next"
import classnames from "classnames"
import { colors, Tooltip } from "@material-ui/core"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import DownloadButton from "../DownloadButton"
import PowerIcon from "@material-ui/icons/Power"

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 72,
    height: "100vh",
    boxSizing: "border-box",
    position: "fixed",
    zIndex: 10,
    top: 0,
    left: 0,
    backgroundColor: colors.grey[900],
  },
  fakeContainer: {
    flexShrink: 0,
    width: 72,
    height: "100vh",
  },
  belowTabButtons: {
    flexGrow: 1,
    // paddingRight: 8,
    "& > *": {
      marginTop: 8,
    },
  },
  headerButton: {
    color: colors.grey[300],
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300,
  },
  tabContainer: {
    width: "100%",
    boxSizing: "border-box",
    textAlign: "right",
    "& .MuiTab-wrapper": {
      paddingLeft: 8,
    },
  },
  tab: {
    color: "#000",
    "& .icon": {},
    "&.Mui-selected": {
      "& .icon": {
        color: colors.blue[500],
      },
    },
  },
  fullHeightTab: {
    ...theme.mixins.toolbar,
    minWidth: 20,
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textTransform: "none",
    color: colors.grey[300],
    "&&& svg": {
      marginBottom: 0,
      marginRight: 8,
      width: 24,
      height: 24,
    },
  },
}))

const getIcon = (t, tooltip) => {
  switch (t) {
    case "Setup":
      return <SettingsIcon className="icon" />
    case "Label":
      return <BorderColorIcon className="icon" />
    case "Samples":
      return <AppsIcon className="icon" />
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
  interfaceType,
  isDesktop,
  fileOpen,
  sessionBoxOpen,
  changeSessionBoxOpen,
  inSession,
  onCreateSession,
  onLeaveSession,
  onJoinSession,
  onClickHome,
  onDownload,
  selectedBrush,
  onChangeSelectedBrush,
  isSmall,
  authConfig,
  changeLoginDrawerOpen,
  onClickManagePlugins,
  collaborateError,
  isWelcomePage,
}) => {
  const c = useStyles()
  const { authProvider, isLoggedIn, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <>
      <div className={c.fakeContainer} />
      <div className={classnames(c.container)}>
        <div className={c.tabContainer}>
          {tabs.length > 0 && (
            <Tabs
              orientation="vertical"
              onChange={(e, newTab) => onChangeTab(newTab.toLowerCase())}
              value={currentTab}
            >
              {tabs.map((name) => (
                <Tab
                  id={`tab-${name.toLowerCase()}`}
                  key={name}
                  classes={{ root: c.fullHeightTab, wrapper: c.tabWrapper }}
                  className={c.tab}
                  icon={
                    <Tooltip title={t(name)} placement="right">
                      {getIcon(name)}
                    </Tooltip>
                  }
                  // label={isSmall ? "" : t}
                  value={name.toLowerCase()}
                />
              ))}
            </Tabs>
          )}
        </div>
        <div className={c.belowTabButtons}>
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
          {!isDesktop && fileOpen && (
            <DownloadButton
              interfaceType={interfaceType}
              onDownload={onDownload}
            />
          )}
          {fileOpen && (
            <BrushButton
              selectedBrush={selectedBrush}
              onChangeSelectedBrush={onChangeSelectedBrush}
            />
          )}
          {additionalButtons}
          {authProvider !== "none" && !isLoggedIn && (
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
        </div>
        {isWelcomePage && (
          <Tooltip placement="right" title={t("Manage Plugins")}>
            <IconButton
              onClick={onClickManagePlugins}
              className={c.headerButton}
            >
              <PowerIcon />
            </IconButton>
          </Tooltip>
        )}
        {!isWelcomePage && (
          <Tooltip placement="right" title={t("Exit to Welcome Page")}>
            <IconButton onClick={onClickHome} className={c.headerButton}>
              <ExitToAppIcon style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          href="https://github.com/UniversalDataTool/universal-data-tool"
          className={c.headerButton}
          target="_blank"
        >
          <GithubIcon />
        </IconButton>
        {!isSmall && isWelcomePage && (
          <IconButton
            href="https://join.slack.com/t/universaldatatool/shared_invite/zt-d8teykwi-iOSOUfxugKR~M4AJN6VL3g"
            className={c.headerButton}
          >
            <SlackIcon />
          </IconButton>
        )}
      </div>
    </>
  )
}

export default memo(HeaderToolbar)
