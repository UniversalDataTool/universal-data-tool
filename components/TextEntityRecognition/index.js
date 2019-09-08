import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import React, { useState } from "react";
import getTaskDescription from "../../utils/get-task-description.js";
import SampleContainer from "../SampleContainer";
import NLPAnnotator from "react-nlp-annotate/components/NLPAnnotator";

var simpleSequenceToEntitySequence = function simpleSequenceToEntitySequence(simpleSeq) {
  var entSeq = [];
  var charsPassed = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = simpleSeq[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var seq = _step.value;

      if (seq.label) {
        entSeq.push({
          text: seq.text,
          label: seq.label,
          start: charsPassed,
          end: charsPassed + seq.text.length
        });
      }

      charsPassed += seq.text.length;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return entSeq;
};

var entitySequenceToSimpleSeq = function entitySequenceToSimpleSeq(doc, entSeq) {
  if (!entSeq) return undefined;
  var simpleSeq = [];
  entSeq = _toConsumableArray(entSeq);
  entSeq.sort(function (a, b) {
    return a.start - b.start;
  });
  var nextEntity = 0;

  for (var i = 0; i < doc.length; i++) {
    if ((entSeq[nextEntity] || {}).start === i) {
      simpleSeq.push({
        text: entSeq[nextEntity].text,
        label: entSeq[nextEntity].label
      });
      i = entSeq[nextEntity].end;
      nextEntity += 1;
    } else {
      if (simpleSeq.length === 0 || simpleSeq[simpleSeq.length - 1].label) {
        simpleSeq.push({
          text: doc[i]
        });
      } else {
        simpleSeq[simpleSeq.length - 1].text += doc[i];
      }
    }
  }

  return simpleSeq;
};

export var TextEntityRecognition = function TextEntityRecognition(props) {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      currentSampleIndex = _useState2[0],
      changeCurrentSampleIndex = _useState2[1];

  var initialSequence = props.taskOutput && props.taskOutput[currentSampleIndex] ? entitySequenceToSimpleSeq(props.taskData[currentSampleIndex].document, props.taskOutput[currentSampleIndex].entities) : undefined;
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
    type: "label-sequence",
    document: props.taskData[currentSampleIndex].document,
    labels: props.interface.labels,
    initialSequence: initialSequence,
    onFinish: function onFinish(result) {
      props.onSaveTaskOutputItem(currentSampleIndex, {
        entities: simpleSequenceToEntitySequence(result)
      });
    }
  }));
};
export default TextEntityRecognition;