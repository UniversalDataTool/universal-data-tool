import React from "react";
import { makeStyles } from "@material-ui/core/styles";
var useStyles = makeStyles({
  linkButtonContainer: {
    marginLeft: 8,
    marginRight: 8
  },
  linkButton: {
    textTransform: "none",
    cursor: "pointer",
    textDecoration: "underline"
  }
});
export default (function (_ref) {
  var onClick = _ref.onClick,
      text = _ref.text;
  var c = useStyles();
  return React.createElement("span", {
    className: c.linkButtonContainer
  }, "(", React.createElement("span", {
    onClick: onClick,
    className: c.linkButton
  }, text), ")");
});