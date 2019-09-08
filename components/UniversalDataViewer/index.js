import React, { useMemo } from "react";
import TextClassification from "../TextClassification";
import TextEntityRecognition from "../TextEntityRecognition";
import ImageSegmentation from "../ImageSegmentation";
import DataEntry from "../DataEntry";
import EmptySampleContainer from "../EmptySampleContainer";
import BadOHA from "../BadOHA";
export var UniversalDataViewer = function UniversalDataViewer(_ref) {
  var oha = _ref.oha,
      hideHeader = _ref.hideHeader,
      hideDescription = _ref.hideDescription,
      datasetName = _ref.datasetName,
      requireCompleteToPressNext = _ref.requireCompleteToPressNext,
      onSaveTaskOutputItem = _ref.onSaveTaskOutputItem;
  // TODO type check w/ superstruct against oha
  var containerProps = useMemo(function () {
    return {
      hideHeader: hideHeader,
      hideDescription: hideDescription,
      datasetName: datasetName,
      requireCompleteToPressNext: requireCompleteToPressNext
    };
  }, [hideHeader, hideDescription, requireCompleteToPressNext, datasetName]);

  if (!oha) {
    return React.createElement(BadOHA, {
      title: "Null OHA",
      description: "Your OHA file isn't defined for some reason."
    });
  }

  if (!oha.taskData || oha.taskData.length === 0) {
    return React.createElement(EmptySampleContainer, null);
  }

  switch (oha.interface.type) {
    case "data_entry":
      return React.createElement(DataEntry, Object.assign({
        containerProps: containerProps
      }, oha, {
        onSaveTaskOutputItem: onSaveTaskOutputItem
      }));

    case "text_classification":
      return React.createElement(TextClassification, Object.assign({
        containerProps: containerProps
      }, oha, {
        onSaveTaskOutputItem: onSaveTaskOutputItem
      }));

    case "text_entity_recognition":
      return React.createElement(TextEntityRecognition, Object.assign({
        containerProps: containerProps
      }, oha, {
        onSaveTaskOutputItem: onSaveTaskOutputItem
      }));

    case "image_segmentation":
      return React.createElement(ImageSegmentation, Object.assign({
        containerProps: containerProps
      }, oha, {
        onSaveTaskOutputItem: onSaveTaskOutputItem
      }));

    default:
      return "\"".concat(oha.interface.type, "\" not supported");
  }
};
export default UniversalDataViewer;