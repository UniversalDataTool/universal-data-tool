import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SampleContainer from "./";
storiesOf("SampleContainer", module).add("Basic", function () {
  return React.createElement(SampleContainer, {
    currentSampleIndex: 0,
    totalSamples: 10,
    onChangeSample: action("onChangeSample"),
    description: "\n## Complete the task on the right\n\nOr just view the content.\n\n      ".trim()
  }, "This is where the task data and interface goes.");
}).add("Hide Title", function () {
  return React.createElement(SampleContainer, {
    currentSampleIndex: 0,
    totalSamples: 10,
    hideHeader: true,
    onChangeSample: action("onChangeSample"),
    description: "\n## Complete the task on the right\n\nOr just view the content.\n\n      ".trim()
  }, "This is where the task data and interface goes.");
}).add("Hide Description", function () {
  return React.createElement(SampleContainer, {
    currentSampleIndex: 0,
    totalSamples: 10,
    hideDescription: true,
    onChangeSample: action("onChangeSample"),
    description: "\n## Complete the task on the right\n\nOr just view the content.\n\n      ".trim()
  }, "This is where the task data and interface goes.");
});