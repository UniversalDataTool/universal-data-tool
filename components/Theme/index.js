import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import "./theme.css";
var useStyles = makeStyles({
  container: {
    fontFamily: '"Inter", sans-serif'
  }
});
var theme = createMuiTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none"
      }
    }
  }
});
export default (function (_ref) {
  var children = _ref.children;
  var classes = useStyles();
  return React.createElement(MuiThemeProvider, {
    theme: theme
  }, React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement("div", {
    className: classes.container
  }, children)));
});