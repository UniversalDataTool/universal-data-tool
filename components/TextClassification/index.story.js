import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TextClassification from "./";
storiesOf("TextClassification", module).add("Basic", function () {
  return React.createElement(TextClassification, {
    containerProps: {
      requireCompleteToPressNext: true
    },
    onSaveTaskOutputItem: action("onSaveTaskOutputItem"),
    interface: {
      type: "data_entry",
      description: "Classify the person name into the correct house.",
      labels: [{
        id: "gryffindor",
        displayName: "Gryffindor",
        description: "Daring, strong nerve and chivalry."
      }, {
        id: "slytherin",
        displayName: "Slytherin",
        description: "Cunning and ambitious. Possibly dark wizard."
      }]
    },
    taskData: [{
      document: "Harry"
    }, {
      document: "Malfoy"
    }],
    taskOutput: [{
      label: "gryffindor"
    }, null]
  });
});