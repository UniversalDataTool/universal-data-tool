import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState } from "react";
export default (function (key, defaultValue) {
  var _useState = useState(function () {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
      return defaultValue;
    }
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      changeState = _useState2[1];

  var changeValue = function changeValue(newValue) {
    window.localStorage.setItem(key, JSON.stringify(newValue));
    changeState(newValue);
  };

  return [state, changeValue];
});