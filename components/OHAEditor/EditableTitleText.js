import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
var useStyles = makeStyles({
  textField: {
    color: "#fff"
  }
});
var SAVE_WAIT = 2000;
export default (function (_ref) {
  var value = _ref.value,
      onChange = _ref.onChange;
  var c = useStyles();

  var _useState = useState({
    editing: false
  }),
      _useState2 = _slicedToArray(_useState, 2),
      _useState2$ = _useState2[0],
      editing = _useState2$.editing,
      newValue = _useState2$.newValue,
      changeEditing = _useState2[1];

  useEffect(function () {
    var listener = function listener(e) {
      if (e.key === "Enter") {
        onChange(newValue);
        changeEditing({
          editing: false
        });
      }
    };

    window.addEventListener("keydown", listener);
    return function () {
      window.removeEventListener("keydown", listener);
    };
  }, [editing, newValue]);
  useEffect(function () {
    if (editing) {
      var timeout = setTimeout(function () {
        onChange(newValue);
        changeEditing({
          editing: false
        });
      }, value === newValue ? SAVE_WAIT * 5 : SAVE_WAIT);
      return function () {
        if (timeout) clearTimeout(timeout);
      };
    } else {
      return function () {};
    }
  }, [editing, newValue]);
  return editing ? React.createElement(TextField, {
    autoFocus: true,
    className: c.textField,
    InputProps: {
      inputProps: {
        style: {
          color: "#fff"
        }
      }
    },
    onChange: function onChange(e) {
      changeEditing({
        editing: true,
        newValue: e.target.value
      });
    },
    value: newValue
  }) : React.createElement("span", {
    onClick: function onClick() {
      if (onChange) {
        changeEditing({
          editing: true,
          newValue: value
        });
      }
    }
  }, value);
});