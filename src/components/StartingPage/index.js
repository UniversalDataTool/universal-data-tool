// @flow

import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import CodeIcon from "@material-ui/icons/Code"
import Typography from "@material-ui/core/Typography"
import Drawer from "@material-ui/core/Drawer"
import Button from "@material-ui/core/Button"
import GithubIcon from "../SampleContainer/GithubIcon.js"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import * as colors from "@material-ui/core/colors"
import templates from "./templates"

const useStyles = makeStyles({
  title: {},
  contentTitle: {
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center"
  },
  contentSubtitle: {
    textAlign: "center",
    wordWrap: "normal",
    paddingLeft: 40,
    paddingRight: 40,
    padding: 30
  },
  headerButton: {
    color: "#fff"
  },
  grow: { flexGrow: 1 },
  list: {
    width: 300
  },
  content: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  bigButton: {
    width: 240,
    height: 200,
    fontSize: 24,
    margin: 20,
    border: `1px dashed ${colors.grey[500]}`
  }
})

export default () => {
  const c = useStyles()
  const [drawerOpen, changeDrawerOpen] = useState(false)

  return (
    <>
      <div>
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
            <Button className={c.headerButton}></Button>
            <IconButton
              href="https://github.com/openhumanannotation/universal-data-tool"
              className={c.headerButton}
            >
              <GithubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={c.contentTitle} variant="h3" noWrap>
              Universal Data Tool
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={c.contentSubtitle} variant="h5">
              Annotate data for Computer Vision, Natural Language Processing,
              Data Entry and More.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={c.content}>
              <Button className={c.bigButton}>Open File</Button>
              <Button className={c.bigButton}>Create from Template</Button>
            </div>
          </Grid>
        </Grid>
      </div>
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
          <ListItem button>
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
