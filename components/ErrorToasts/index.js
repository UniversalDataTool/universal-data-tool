import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Collapse from "@material-ui/core/Collapse";
import Fade from "@material-ui/core/Fade";
var useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none"
  },
  errorBox: {
    display: "flex",
    backgroundColor: red[700],
    color: "#fff",
    padding: 4,
    marginBottom: 4
  }
});
export default (function (_ref) {
  var errors = _ref.errors;
  var c = useStyles();
  return React.createElement("div", {
    className: c.root
  }, errors.map(function (err) {
    return React.createElement(Collapse, {
      key: err.id,
      in: err.life < 5000
    }, React.createElement(Fade, {
      in: err.life > 500
    }, React.createElement("div", {
      className: c.errorBox
    }, err.message)));
  }));
});