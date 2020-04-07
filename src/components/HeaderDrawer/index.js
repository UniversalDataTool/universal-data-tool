//@flow weak

import React, { useCallback, useState } from "react"
import Drawer from "@material-ui/core/Drawer"
import { useDropzone } from "react-dropzone"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import { GoMarkGithub } from "react-icons/go"
import { makeStyles } from "@material-ui/core/styles"
import HomeIcon from "@material-ui/icons/Home"
import { IconContext } from "react-icons"
import { FaTrashAlt } from "react-icons/fa"
import templates from "../StartingPage/templates"
import * as colors from "@material-ui/core/colors"
import FileIcon from "@material-ui/icons/InsertDriveFile"
import NoteAddIcon from "@material-ui/icons/NoteAdd"

const useStyles = makeStyles({})

export default ({
  recentItems,
  onClickHome,
  onCloseDrawer,
  drawerOpen,
  onOpenFile,
  onOpenRecentItem,
  onClickTemplate,
}) => {
  const c = useStyles()
  const [displayItem, setDisplayItem] = useState(recentItems);
  const onDrop = useCallback((acceptedFiles) => {
    onOpenFile(acceptedFiles[0])
  }, [])

  const onDeleteFile = useCallback((index) => {
    recentItems.splice((index),1);
    
    localStorage.removeItem('recentItems');
    localStorage.setItem('recentItems',JSON.stringify(recentItems));
    
    setDisplayItem(recentItems);
    //window.location.reload(false);
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  
  return (
    <Drawer open={drawerOpen} onClose={onCloseDrawer}>
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
        {displayItem.length === 0 ? (
          <ListItem>
            <ListItemText
              style={{ textAlign: "center", color: colors.grey[500] }}
            >
              No Recent Items
            </ListItemText>
          </ListItem>
        ) : (
          displayItem.map((ri, index) => (            
            <ListItem
              key={ri.fileName}
              button           
            >
              <ListItemIcon
                onClick={() => {
                  onOpenRecentItem(ri)
                }}
              >
              <FileIcon />
              </ListItemIcon>
              <ListItemText
                onClick={() => {
                  onOpenRecentItem(ri)
                }}
              >{ri.fileName}</ListItemText>
              <ListItemIcon
                onClick={() => {onDeleteFile(index)}}
              ><FaTrashAlt /></ListItemIcon>
            </ListItem>
          ))
        )}
        <ListSubheader>Create From Template</ListSubheader>
        {templates.map((template) => (
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
  )
}
