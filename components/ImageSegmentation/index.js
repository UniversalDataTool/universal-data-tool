import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Annotator from "react-image-annotate";
var useStyles = makeStyles({});
export default (function (_ref) {
  var iface = _ref.interface,
      _ref$taskData = _ref.taskData,
      taskData = _ref$taskData === void 0 ? [] : _ref$taskData;
  var c = useStyles();
  return React.createElement(Annotator, {
    images: [{
      src: "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
      name: "Image 1"
    }]
  });
});