// @flow

import React, { useState, createContext, useContext, useCallback } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import CodeIcon from "@material-ui/icons/Code"
import SettingsIcon from "@material-ui/icons/Settings"
import StorageIcon from "@material-ui/icons/Storage"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import HomeIcon from "@material-ui/icons/Home"
import Typography from "@material-ui/core/Typography"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import NoteAddIcon from "@material-ui/icons/NoteAdd"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import * as colors from "@material-ui/core/colors"
import GithubIcon from "./GithubIcon"
import templates from "../StartingPage/templates"
import { useDropzone } from "react-dropzone"
import { makeStyles } from "@material-ui/core/styles"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { IconContext } from "react-icons"
import { GoMarkGithub } from "react-icons/go"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import CollaborateButton from "../CollaborateButton"
import DownloadButton from "../DownloadButton"

const useStyles = makeStyles(theme => ({
  headerButton: {
    marginLeft: 16,
    color: "#888"
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300
  },
  tab: {
    color: "#000",
    // height: "100%",
    "& .icon": {}
  },
  fullHeightTab: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down("sm")]: {
      minWidth: 20
    }
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
      height: 18
    }
  }
}))

export const HeaderContext = createContext({ recentItems: [] })

const getIcon = (t: string) => {
  switch (t) {
    case "Settings":
      return <SettingsIcon className="icon" />
    case "Label":
      return <BorderColorIcon className="icon" />
    case "Samples":
      return <StorageIcon className="icon" />
  }
}

export default ({
  additionalButtons = [],
  title = "Universal Data Tool - Welcome!",
  currentTab,
  onChangeTab,
  tabs = []
}) => {
  const c = useStyles()
  const [drawerOpen, changeDrawerOpen] = useState(false)
  let {
    recentItems,
    onClickTemplate,
    onClickHome,
    onOpenFile,
    onOpenRecentItem,
    isDesktop,
    inSession,
    onJoinSession,
    onCreateSession,
    onLeaveSession,
    sessionBoxOpen,
    changeSessionBoxOpen,
    fileOpen,
    onDownload
  } = useContext(HeaderContext)
  if (!recentItems) recentItems = []

  const onDrop = useCallback(acceptedFiles => {
    onOpenFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const isSmall = useMediaQuery("(max-width: 800px)")

  return (
    <>
      <AppBar color="transparent" position="static">
        <Toolbar variant="dense">
          {!isDesktop && (
            <IconButton
              onClick={() => changeDrawerOpen(true)}
              className={c.headerButton}
            >
              <MenuIcon />
            </IconButton>
          )}
          {title}
          <CollaborateButton
            sessionBoxOpen={sessionBoxOpen}
            changeSessionBoxOpen={changeSessionBoxOpen}
            fileOpen={fileOpen}
            inSession={inSession}
            onCreateSession={onCreateSession}
            onLeaveSession={onLeaveSession}
            onJoinSession={onJoinSession}
          />
          {!isDesktop && fileOpen && <DownloadButton onDownload={onDownload} />}
          <div className={c.grow} />
          {additionalButtons}
          {tabs.length > 0 && (
            <Tabs
              onChange={(e, newTab) => onChangeTab(newTab.toLowerCase())}
              value={currentTab}
            >
              {tabs.map(t => (
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
          {!isSmall && (
            <IconButton
              href="https://github.com/openhumanannotation/universal-data-tool"
              className={c.headerButton}
            >
              <GithubIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => changeDrawerOpen(false)}>
        <List className={c.list}>
          <ListItem onClick={onClickHome} button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
          <ListItem {...getRootProps()} button>
            <ListItemIcon>
              <NoteAddIcon />
            </ListItemIcon>
            <ListItemText>Open File</ListItemText>
            <input {...getInputProps()} />
          </ListItem>
          <ListSubheader>Recent Files</ListSubheader>
          {recentItems.length === 0 ? (
            <ListItem>
              <ListItemText
                style={{ textAlign: "center", color: colors.grey[500] }}
              >
                No Recent Items
              </ListItemText>
            </ListItem>
          ) : (
            recentItems.map(ri => (
              <ListItem
                key={ri.fileName}
                button
                onClick={() => {
                  onOpenRecentItem(ri)
                }}
              >
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText>{ri.fileName}</ListItemText>
              </ListItem>
            ))
          )}
          <ListSubheader>Create From Template</ListSubheader>
          {templates.map(template => (
            <ListItem
              key={template.name}
              button
              onClick={() => onClickTemplate(template)}
            >
              <ListItemIcon>
                <template.Icon />
              </ListItemIcon>
              <ListItemText>{template.name}</ListItemText>
            </ListItem>
          ))}
          <ListSubheader>Explore More</ListSubheader>
          {/* <ListItem button>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText>Integrate</ListItemText>
          </ListItem> */}
          <ListItem
            button
            onClick={() => {
              window.location.href =
                "https://github.com/OpenHumanAnnotation/universal-data-tool/releases"
            }}
          >
            <ListItemIcon>
              <GoMarkGithub />
            </ListItemIcon>
            <ListItemText>Github</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
