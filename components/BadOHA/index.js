import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
var useStyles = makeStyles({
  root: {
    padding: 50,
    textAlign: "center"
  },
  title: {
    margin: 50
  },
  explain: {}
});
export default (function (_ref) {
  var title = _ref.title,
      description = _ref.description,
      children = _ref.children;
  var c = useStyles();
  return React.createElement("div", {
    className: c.root
  }, React.createElement(Typography, {
    variant: "h3",
    component: "div",
    className: c.title
  }, title), React.createElement(Typography, {
    variant: "h5",
    component: "div",
    className: c.explain
  }, description || children));
});