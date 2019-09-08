import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Header from "../Header";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import templates from "./templates";
import * as colors from "@material-ui/core/colors";
import VideoIcon from "@material-ui/icons/OndemandVideo";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import TemplateIcon from "@material-ui/icons/Description";
import { useDropzone } from "react-dropzone";
import CreateFromTemplateDialog from "../CreateFromTemplateDialog";
var useStyles = makeStyles({
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
  bigButton: {
    width: 240,
    fontSize: 24,
    margin: 20,
    border: "1px dashed ".concat(colors.grey[500])
  },
  bigButtonContent: {
    display: "flex",
    lineHeight: 1.5,
    height: 160,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  bigIcon: {
    margin: 20,
    width: 64,
    height: 64
  },
  grow: {
    flexGrow: 1
  },
  content: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  headerButton: {
    color: "#fff"
  }
});
export default (function (_ref) {
  var onFileDrop = _ref.onFileDrop,
      onOpenTemplate = _ref.onOpenTemplate;
  var c = useStyles();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      createFromTemplateDialogOpen = _useState2[0],
      changeCreateFromTemplateDialogOpen = _useState2[1];

  var onDrop = useMemo(function () {
    return function (acceptedFiles) {
      onFileDrop(acceptedFiles[0]);
    };
  }, [onFileDrop]);

  var _useDropzone = useDropzone({
    onDrop: onDrop
  }),
      getRootProps = _useDropzone.getRootProps,
      getInputProps = _useDropzone.getInputProps,
      isDragActive = _useDropzone.isDragActive;

  return React.createElement("div", null, React.createElement(CreateFromTemplateDialog, {
    open: createFromTemplateDialogOpen,
    onSelect: function onSelect(template) {
      return onOpenTemplate(template);
    },
    onClose: function onClose() {
      return changeCreateFromTemplateDialogOpen(false);
    }
  }), React.createElement(Header, {
    additionalButtons: [React.createElement(Button, {
      href: "https://github.com/OpenHumanAnnotation/universal-data-tool/releases",
      className: c.headerButton
    }, "Download Universal Data Tool")]
  }), React.createElement(Grid, {
    container: true
  }, React.createElement(Grid, {
    item: true,
    xs: 12
  }, React.createElement(Typography, {
    className: c.contentTitle,
    variant: "h3",
    noWrap: true
  }, "Universal Data Tool")), React.createElement(Grid, {
    item: true,
    xs: 12
  }, React.createElement(Typography, {
    className: c.contentSubtitle,
    variant: "h5"
  }, "Annotate data for Computer Vision, Natural Language Processing, Data Entry and More.")), React.createElement(Grid, {
    item: true,
    xs: 12
  }, React.createElement("div", {
    className: c.content
  }, React.createElement(Button, Object.assign({}, getRootProps(), {
    className: c.bigButton
  }), React.createElement("div", {
    className: c.bigButtonContent
  }, React.createElement("div", null, !isDragActive ? "Open File" : "Drop File Here"), React.createElement(FileIcon, {
    className: c.bigIcon
  }), React.createElement("input", getInputProps()))), React.createElement(Button, {
    onClick: function onClick() {
      changeCreateFromTemplateDialogOpen(true);
    },
    className: c.bigButton
  }, React.createElement("div", {
    className: c.bigButtonContent
  }, React.createElement("div", null, "Create from Template"), React.createElement(TemplateIcon, {
    className: c.bigIcon
  })))))));
});