import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from "react";
import getTaskDescription from "../../utils/get-task-description.js";
import SampleContainer from "../SampleContainer";
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator";
export var TextClassification = function TextClassification(props) {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      currentSampleIndex = _useState2[0],
      changeCurrentSampleIndex = _useState2[1];

  var initialLabels = props.taskOutput && props.taskOutput[currentSampleIndex] ? [props.taskOutput[currentSampleIndex].label] || props.taskOutput[currentSampleIndex].labels : undefined;
  return React.createElement(SampleContainer, Object.assign({}, props.containerProps, {
    currentSampleIndex: currentSampleIndex,
    totalSamples: props.taskData.length,
    taskOutput: props.taskOutput,
    description: getTaskDescription(props.taskData[currentSampleIndex]) || props.interface.description,
    onChangeSample: function onChangeSample(sampleIndex) {
      return changeCurrentSampleIndex(sampleIndex);
    }
  }), React.createElement(NLPAnnotator, {
    key: currentSampleIndex,
    type: "label-document",
    labels: props.interface.labels,
    multipleLabels: props.interface.multiple,
    document: props.taskData[currentSampleIndex].document,
    initialLabels: initialLabels,
    onFinish: function onFinish(result) {
      props.onSaveTaskOutputItem(currentSampleIndex, result);
    }
  }));
};
export default TextClassification;