import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import GithubIcon from "../Header/GithubIcon.js";
import Header from "../Header";
import brace from "brace";
import AceEditor from "react-ace";
import NextIcon from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import defaultOHAObject from "./default-oha-object";
import UniversalDataViewer from "../UniversalDataViewer";
import EditableTitleText from "./EditableTitleText.js";
import "brace/mode/javascript";
import "brace/theme/github";
var useStyles = makeStyles({
  headerButton: {
    color: "#fff"
  },
  saveIcon: {
    marginRight: 4
  },
  editIcon: {
    marginLeft: 4
  }
});
export default (function (_ref) {
  var _ref$datasetName = _ref.datasetName,
      datasetName = _ref$datasetName === void 0 ? "Universal Data Tool" : _ref$datasetName,
      oha = _ref.oha,
      content = _ref.content,
      _ref$fileName = _ref.fileName,
      fileName = _ref$fileName === void 0 ? "unnamed" : _ref$fileName,
      onChangeFileName = _ref.onChangeFileName,
      _ref$onChangeContent = _ref.onChangeContent,
      onChangeContent = _ref$onChangeContent === void 0 ? function () {
    return null;
  } : _ref$onChangeContent,
      _ref$onChangeOHA = _ref.onChangeOHA,
      onChangeOHA = _ref$onChangeOHA === void 0 ? function () {
    return null;
  } : _ref$onChangeOHA,
      onFileDrop = _ref.onFileDrop,
      _ref$initialMode = _ref.initialMode,
      initialMode = _ref$initialMode === void 0 ? "json" : _ref$initialMode;
  var c = useStyles();

  var _useState = useState(initialMode),
      _useState2 = _slicedToArray(_useState, 2),
      mode = _useState2[0],
      changeMode = _useState2[1];

  var _useState3 = useState(content || defaultOHAObject),
      _useState4 = _slicedToArray(_useState3, 2),
      jsonText = _useState4[0],
      changeJSONText = _useState4[1];

  useEffect(function () {
    onChangeContent(jsonText);

    try {
      // schema validation etc.
      onChangeOHA(JSON.parse(jsonText));
    } catch (e) {}
  }, [jsonText]);
  return React.createElement("div", null, React.createElement(Header, {
    title: React.createElement(React.Fragment, null, (mode === "json" ? "JSON Editor" : "Sample Editor") + " - ", React.createElement(EditableTitleText, {
      onChange: onChangeFileName,
      value: fileName
    })),
    additionalButtons: [// <IconButton disabled className={c.headerButton}>
    //   <SaveIcon className={c.saveIcon} />
    // </IconButton>,
    mode === "json" ? React.createElement(Button, {
      onClick: function onClick() {
        return changeMode("sample");
      },
      className: c.headerButton
    }, "Switch to Sample Editor", React.createElement(NextIcon, null)) : React.createElement(Button, {
      onClick: function onClick() {
        return changeMode("json");
      },
      className: c.headerButton
    }, "Switch to JSON Editor", React.createElement(EditIcon, {
      className: c.editIcon
    }))]
  }), React.createElement("div", null, mode === "json" ? React.createElement(AceEditor, {
    theme: "github",
    mode: "javascript",
    width: "100%",
    value: jsonText,
    editorProps: {
      $blockScrolling: Infinity
    },
    onChange: function onChange(t) {
      return changeJSONText(t);
    }
  }) : React.createElement(UniversalDataViewer, {
    onSaveTaskOutputItem: function onSaveTaskOutputItem(index, output) {
      var newOHA = _objectSpread({}, oha);

      if (!newOHA.taskOutput) newOHA.taskOutput = newOHA.taskData.map(function (td) {
        return null;
      });
      newOHA.taskOutput[index] = output;
      changeJSONText(JSON.stringify(newOHA, null, "  "));
    },
    oha: oha
  })));
});