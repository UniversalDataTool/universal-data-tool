import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TextEntityRecognition from "./";
storiesOf("TextEntityRecognition", module).add("Basic", function () {
  return React.createElement(TextEntityRecognition, {
    onSaveTaskOutputItem: action("onSaveTaskOutputItem"),
    interface: {
      type: "text_entity_recognition",
      description: "Label words or phrases as food or hat.",
      overlapAllowed: false,
      labels: [{
        id: "food",
        displayName: "Food",
        description: "Edible item."
      }, {
        id: "hat",
        displayName: "Hat",
        description: "Something worn on the head."
      }]
    },
    taskData: [{
      document: "This strainer makes a great hat, I'll wear it while I serve spaghetti!"
    }],
    taskOutput: [{
      entities: [{
        text: "strainer",
        label: "hat",
        start: 5,
        end: 13
      }, {
        text: "spaghetti",
        label: "food",
        start: 60,
        end: 69
      }]
    }]
  });
});