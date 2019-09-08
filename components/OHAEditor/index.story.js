import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import OHAEditor from "./";

var Controller = function Controller(props) {
  var _useState = useState(props.initialOHA),
      _useState2 = _slicedToArray(_useState, 2),
      oha = _useState2[0],
      changeOHA = _useState2[1];

  return React.createElement(OHAEditor, Object.assign({
    oha: oha,
    onChangeOHA: changeOHA
  }, props));
};

storiesOf("OHAEditor", module).add("Basic", function () {
  return React.createElement(Controller, {
    initialOHA: {},
    onChangeFileName: action("onChangeFileName"),
    onChangeOHA: action("onChangeOHA")
  });
});