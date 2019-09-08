import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
var useStyles = makeStyles({});
export default (function () {
  var c = useStyles();
  return React.createElement(Dialog, null, React.createElement(DialogTitle, null, "Open File"), React.createElement(DialogContent, null, "asd"), React.createElement(DialogActions, null, React.createElement(Button, null, "Close")));
});