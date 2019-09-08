import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useState, useEffect } from "react";
var REFRESH_INTERVAL = 100;
export default (function () {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      errors = _useState2[0],
      changeErrors = _useState2[1];

  useEffect(function () {
    if (errors.length === 0) return function () {};
    var interval = setInterval(function () {
      changeErrors(errors.map(function (err) {
        return _objectSpread({}, err, {
          life: err.life - REFRESH_INTERVAL
        });
      }).filter(function (err) {
        return err.life > 0;
      }));
    }, REFRESH_INTERVAL);
    return function () {
      return clearInterval(interval);
    };
  }, [errors]);

  function addError(message) {
    changeErrors(errors.concat([{
      id: Math.random().toString().split(".")[1],
      message: message,
      life: 5000
    }]));
  }

  return [errors, addError];
});