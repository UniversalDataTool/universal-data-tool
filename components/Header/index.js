import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, createContext, useContext, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CodeIcon from "@material-ui/icons/Code";
import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import * as colors from "@material-ui/core/colors";
import GithubIcon from "./GithubIcon";
import templates from "../StartingPage/templates";
import { useDropzone } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
var useStyles = makeStyles({
  headerButton: {
    color: "#fff"
  },
  grow: {
    flexGrow: 1
  },
  list: {
    width: 300
  }
});
export var HeaderContext = createContext({
  recentItems: []
});
export default (function (_ref) {
  var _ref$additionalButton = _ref.additionalButtons,
      additionalButtons = _ref$additionalButton === void 0 ? [] : _ref$additionalButton,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? "Universal Data Tool - Welcome!" : _ref$title;
  var c = useStyles();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      drawerOpen = _useState2[0],
      changeDrawerOpen = _useState2[1];

  var _useContext = useContext(HeaderContext),
      recentItems = _useContext.recentItems,
      onClickTemplate = _useContext.onClickTemplate,
      onClickHome = _useContext.onClickHome,
      onOpenFile = _useContext.onOpenFile,
      onOpenRecentItem = _useContext.onOpenRecentItem;

  if (!recentItems) recentItems = [];
  var onDrop = useCallback(function (acceptedFiles) {
    onOpenFile(acceptedFiles[0]);
  }, []);

  var _useDropzone = useDropzone({
    onDrop: onDrop
  }),
      getRootProps = _useDropzone.getRootProps,
      getInputProps = _useDropzone.getInputProps;

  return React.createElement(React.Fragment, null, React.createElement(AppBar, {
    position: "static"
  }, React.createElement(Toolbar, null, React.createElement(IconButton, {
    onClick: function onClick() {
      return changeDrawerOpen(true);
    },
    className: c.headerButton
  }, React.createElement(MenuIcon, null)), React.createElement(Typography, {
    className: c.title,
    variant: "h6",
    noWrap: true
  }, title), React.createElement("div", {
    className: c.grow
  }), additionalButtons, React.createElement(IconButton, {
    href: "https://github.com/openhumanannotation/universal-data-tool",
    className: c.headerButton
  }, React.createElement(GithubIcon, null)))), React.createElement(Drawer, {
    open: drawerOpen,
    onClose: function onClose() {
      return changeDrawerOpen(false);
    }
  }, React.createElement(List, {
    className: c.list
  }, React.createElement(ListItem, {
    onClick: onClickHome,
    button: true
  }, React.createElement(ListItemIcon, null, React.createElement(HomeIcon, null)), React.createElement(ListItemText, null, "Home")), React.createElement(ListItem, Object.assign({}, getRootProps(), {
    button: true
  }), React.createElement(ListItemIcon, null, React.createElement(NoteAddIcon, null)), React.createElement(ListItemText, null, "Open File"), React.createElement("input", getInputProps())), React.createElement(ListSubheader, null, "Recent Files"), recentItems.length === 0 ? React.createElement(ListItem, null, React.createElement(ListItemText, {
    style: {
      textAlign: "center",
      color: colors.grey[500]
    }
  }, "No Recent Items")) : recentItems.map(function (ri) {
    return React.createElement(ListItem, {
      key: ri.fileName,
      button: true,
      onClick: function onClick() {
        onOpenRecentItem(ri);
      }
    }, React.createElement(ListItemIcon, null, React.createElement(FileIcon, null)), React.createElement(ListItemText, null, ri.fileName));
  }), React.createElement(ListSubheader, null, "Create From Template"), templates.map(function (template) {
    return React.createElement(ListItem, {
      key: template.name,
      button: true,
      onClick: function onClick() {
        return onClickTemplate(template);
      }
    }, React.createElement(ListItemIcon, null, React.createElement(template.Icon, null)), React.createElement(ListItemText, null, template.name));
  }), React.createElement(ListSubheader, null, "Explore More"), React.createElement(ListItem, {
    button: true,
    onClick: function onClick() {
      window.location.href = "https://github.com/OpenHumanAnnotation/universal-data-tool/releases";
    }
  }, React.createElement(ListItemIcon, null, React.createElement(GithubIcon, null)), React.createElement(ListItemText, null, "Github")))));
});