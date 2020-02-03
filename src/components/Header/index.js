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

const useStyles = makeStyles(theme => ({
  headerButton: {
    color: "#fff"
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300
  },
  tab: {
    color: "#fff",
    height: "100%"
  },
  fullHeightTab: {
    ...theme.mixins.toolbar
  }
}))

export const HeaderContext = createContext({ recentItems: [] })

const getIcon = (t: string) => {
  switch (t) {
    case "Settings":
      return <SettingsIcon />
    case "Label":
      return <BorderColorIcon />
    case "Samples":
      return <StorageIcon />
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
    onOpenRecentItem
  } = useContext(HeaderContext)
  if (!recentItems) recentItems = []

  const onDrop = useCallback(acceptedFiles => {
    onOpenFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={() => changeDrawerOpen(true)}
            className={c.headerButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={c.title} variant="h6" noWrap>
            {title}
          </Typography>
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
                  classes={{ root: c.fullHeightTab }}
                  className={c.tab}
                  icon={getIcon(t)}
                  label={t}
                  value={t.toLowerCase()}
                />
              ))}
            </Tabs>
          )}
          <IconButton
            href="https://github.com/openhumanannotation/universal-data-tool"
            className={c.headerButton}
          >
            <GithubIcon />
          </IconButton>
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
              <GithubIcon />
            </ListItemIcon>
            <ListItemText>Github</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
