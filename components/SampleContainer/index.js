import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ReactMarkdown from "react-markdown";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ScatterPlotIcon from "@material-ui/icons/ScatterPlot";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import InnerCircleIcon from "@material-ui/icons/RadioButtonChecked";
import CircleIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Typography from "@material-ui/core/Typography";
import GithubIcon from "../Header/GithubIcon.js";
import * as colors from "@material-ui/core/colors";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import LinkButton from "./LinkButton";
import range from "lodash/range";
var useStyles = makeStyles(function (theme) {
  return {
    footer: {
      backgroundColor: "#fff",
      marginTop: 40
    },
    footerContent: {
      alignItems: "center",
      padding: 20,
      display: "flex",
      justifyContent: "space-between"
    },
    footerBorder: {
      borderTop: "1px solid #ccc",
      marginLeft: 20,
      marginRight: 20
    },
    footerCount: {
      display: "inline-flex"
    },
    allSamplesButton: {
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.5)",
      marginRight: 10,
      paddingLeft: 8
    },
    sampleIcon: {
      marginRight: 8
    },
    menuButton: {
      marginRight: 8,
      color: "#fff"
    },
    grow: {
      flexGrow: 1
    },
    buttons: {
      "& > *": {
        margin: 4
      }
    },
    description: {
      padding: 10,
      "& img": {
        maxWidth: "calc(100% - 200px)",
        maxHeight: 600
      }
    },
    sectionHeader: {
      fontWeight: 700,
      fontSize: 12,
      padding: 10,
      paddingTop: 16,
      textTransform: "uppercase",
      color: colors.grey[600]
    },
    content: {
      padding: 10 // minHeight: "calc(100vh - 200px)"

    }
  };
});
export var SampleContainer = function SampleContainer(_ref) {
  var _ref$hideDescription = _ref.hideDescription,
      defaultHideDescription = _ref$hideDescription === void 0 ? false : _ref$hideDescription,
      lastSampleExitText = _ref.lastSampleExitText,
      _ref$requireCompleteT = _ref.requireCompleteToPressNext,
      requireCompleteToPressNext = _ref$requireCompleteT === void 0 ? false : _ref$requireCompleteT,
      taskData = _ref.taskData,
      minContentHeight = _ref.minContentHeight,
      currentSampleIndex = _ref.currentSampleIndex,
      totalSamples = _ref.totalSamples,
      onChangeSample = _ref.onChangeSample,
      _ref$taskOutput = _ref.taskOutput,
      taskOutput = _ref$taskOutput === void 0 ? [] : _ref$taskOutput,
      description = _ref.description,
      children = _ref.children;
  var c = useStyles();

  var _useState = useState(defaultHideDescription),
      _useState2 = _slicedToArray(_useState, 2),
      hideDescription = _useState2[0],
      changeHideDescription = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      sampleDrawerOpen = _useState4[0],
      changeSampleDrawerOpen = _useState4[1];

  return React.createElement(React.Fragment, null, React.createElement(Grid, {
    container: true
  }, !hideDescription && React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: 6
  }, React.createElement("div", {
    className: c.sectionHeader
  }, "Description", React.createElement(LinkButton, {
    onClick: function onClick() {
      return changeHideDescription(true);
    },
    text: "hide"
  })), React.createElement("div", {
    className: c.description
  }, React.createElement(ReactMarkdown, {
    escapeHtml: false,
    source: description
  }))), React.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: hideDescription ? 12 : 6
  }, React.createElement("div", {
    className: c.sectionHeader
  }, "Sample ", totalSamples > 1 ? currentSampleIndex + 1 : "", hideDescription && React.createElement(LinkButton, {
    onClick: function onClick() {
      return changeHideDescription(false);
    },
    text: "show description"
  }), React.createElement(LinkButton, {
    onClick: function onClick() {
      return changeSampleDrawerOpen(true);
    },
    text: "view all"
  })), React.createElement("div", {
    style: {
      minHeight: minContentHeight
    },
    className: c.content
  }, children)), totalSamples > 1 && React.createElement(Grid, {
    item: true,
    xs: 12
  }, React.createElement("div", {
    className: c.footer
  }, React.createElement("div", {
    className: c.footerBorder
  }), React.createElement("div", {
    className: c.footerContent
  }, React.createElement(Button, {
    onClick: function onClick() {
      return onChangeSample((currentSampleIndex - 1 + totalSamples) % totalSamples);
    }
  }, React.createElement(LeftIcon, null), " Prev Sample"), React.createElement(Button, {
    onClick: function onClick() {
      return changeSampleDrawerOpen(true);
    },
    className: c.footerCount
  }, currentSampleIndex + 1, " / ", totalSamples), React.createElement(Button, {
    disabled: requireCompleteToPressNext && !taskOutput[currentSampleIndex],
    onClick: function onClick() {
      return onChangeSample((currentSampleIndex + 1) % totalSamples);
    }
  }, requireCompleteToPressNext && !taskOutput[currentSampleIndex] ? "Save to Continue" : "Next Sample", React.createElement(RightIcon, null)))))), React.createElement(Drawer, {
    open: sampleDrawerOpen,
    anchor: "left",
    onClose: function onClose() {
      return changeSampleDrawerOpen(false);
    }
  }, React.createElement(List, {
    style: {
      minWidth: 300
    }
  }, React.createElement(ListSubheader, null, "Samples"), range(0, totalSamples).map(function (i) {
    return React.createElement(ListItem, {
      style: {
        backgroundColor: i === currentSampleIndex ? colors.grey[200] : undefined
      },
      button: true,
      onClick: function onClick() {
        return onChangeSample(i);
      }
    }, React.createElement(ListItemIcon, {
      style: {
        color: i === currentSampleIndex ? colors.blue[500] : undefined
      }
    }, taskOutput[i] ? React.createElement(CheckCircle, null) : React.createElement(CircleIcon, null)), React.createElement(ListItemText, null, "Sample ", i + 1));
  }))));
};
export default SampleContainer;