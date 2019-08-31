// @flow

import React, { useState } from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import CodeIcon from "@material-ui/icons/Code"
import Typography from "@material-ui/core/Typography"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import * as colors from "@material-ui/core/colors"
import GithubIcon from "./GithubIcon"
import templates from "../StartingPage/templates"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  headerButton: {
    color: "#fff"
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300
  }
})

export default ({ additionalButtons = [] }) => {
  const c = useStyles()
  const [drawerOpen, changeDrawerOpen] = useState(false)

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
            Universal Data Tool - Welcome!
          </Typography>
          <div className={c.grow} />
          {additionalButtons}
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
          <ListSubheader>Recent Files</ListSubheader>
          <ListItem>
            <ListItemText
              style={{ textAlign: "center", color: colors.grey[500] }}
            >
              No Recent Items
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FileIcon />
            </ListItemIcon>
            <ListItemText>Open New File</ListItemText>
          </ListItem>
          <ListSubheader>Create From Template</ListSubheader>
          {templates.map(template => (
            <ListItem button>
              <ListItemIcon>
                <template.Icon />
              </ListItemIcon>
              <ListItemText>{template.name}</ListItemText>
            </ListItem>
          ))}
          <ListSubheader>Explore More</ListSubheader>
          <ListItem button>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText>Integrate</ListItemText>
          </ListItem>
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
