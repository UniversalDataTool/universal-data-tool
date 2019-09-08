import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from "react";
import Survey from "material-survey/components/Survey";
import getTaskDescription from "../../utils/get-task-description.js";
import SampleContainer from "../SampleContainer";
export var DataEntry = function DataEntry(props) {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      currentSampleIndex = _useState2[0],
      changeCurrentSampleIndex = _useState2[1];

  return React.createElement(SampleContainer, Object.assign({}, props.containerProps, {
    currentSampleIndex: currentSampleIndex,
    totalSamples: props.taskData.length,
    taskOutput: props.taskOutput,
    description: getTaskDescription(props.taskData[currentSampleIndex]) || props.interface.description,
    onChangeSample: function onChangeSample(sampleIndex) {
      return changeCurrentSampleIndex(sampleIndex);
    }
  }), React.createElement(Survey, {
    key: currentSampleIndex,
    variant: "flat",
    form: props.taskData[currentSampleIndex].surveyjs || props.interface.surveyjs,
    defaultAnswers: props.taskOutput && props.taskOutput[currentSampleIndex] ? props.taskOutput[currentSampleIndex] : undefined,
    completeText: "Save",
    onFinish: function onFinish(answers) {
      props.onSaveTaskOutputItem(currentSampleIndex, answers);
    }
  }));
};
export default DataEntry;