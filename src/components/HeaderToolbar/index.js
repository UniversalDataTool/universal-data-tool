// @flow weak

import React, { memo } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
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
import { colors } from "@material-ui/core"
import GearIcon from "@material-ui/icons/Settings"

const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 8,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 72,
    height: "100vh",
    boxSizing: "border-box",
    backgroundColor: colors.grey[900],
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
    color: colors.grey[300],
    "&&& svg": {
      marginBottom: 0,
      marginRight: 8,
      width: 24,
      height: 24,
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
    <div className={c.container}>
      {/* {!isDesktop && (
        <IconButton onClick={onOpenDrawer} className={c.headerButton}>
          <MenuIcon />
        </IconButton>
      )} */}
      <div className={c.tabContainer}>
        {tabs.length > 0 && (
          <Tabs
            orientation="vertical"
            onChange={(e, newTab) => onChangeTab(newTab.toLowerCase())}
            value={currentTab}
          >
            {tabs.map((t) => (
              <Tab
                key={t}
                classes={{ root: c.fullHeightTab, wrapper: c.tabWrapper }}
                className={c.tab}
                icon={getIcon(t)}
                // label={isSmall ? "" : t}
                value={t.toLowerCase()}
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
  )
}

export default memo(HeaderToolbar)
