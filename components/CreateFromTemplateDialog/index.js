import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import templates from "../StartingPage/templates";
import { grey } from "@material-ui/core/colors";
var useStyles = makeStyles({
  bigButton: {
    padding: 10,
    width: 150,
    height: 120,
    border: "1px solid #ccc",
    margin: 10
  },
  bigIcon: {
    width: 48,
    height: 48
  }
});
export default (function (_ref) {
  var open = _ref.open,
      onClose = _ref.onClose,
      onSelect = _ref.onSelect;
  var c = useStyles();
  return React.createElement(Dialog, {
    open: open,
    onClose: onClose
  }, React.createElement(DialogTitle, null, "Create from Template"), React.createElement(DialogContent, null, templates.map(function (template) {
    return React.createElement(Button, {
      onClick: function onClick() {
        return onSelect(template);
      },
      className: c.bigButton
    }, React.createElement("div", null, React.createElement("div", null, template.name), React.createElement("div", null, React.createElement(template.Icon, {
      className: c.bigIcon
    }))));
  })), React.createElement(DialogActions, null, React.createElement(Button, {
    onClick: function onClick() {
      return onClose();
    }
  }, "Close")));
});