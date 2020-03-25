// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TextClassification from "./"

storiesOf("TextClassification", module)
  .add("Basic", () => (
    <TextClassification
      containerProps={{ requireCompleteToPressNext: true }}
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      interface={{
        type: "text_classification",
        description: "Classify the person name into the correct house.",
        labels: [
          {
            id: "gryffindor",
            displayName: "Gryffindor",
            description: "Daring, strong nerve and chivalry."
          },
          {
            id: "slytherin",
            displayName: "Slytherin",
            description: "Cunning and ambitious. Possibly dark wizard."
          }
        ]
      }}
      taskData={[{ document: "Harry" }, { document: "Malfoy" }]}
      taskOutput={[{ label: "gryffindor" }, null]}
    />
  ))
  .add("Multi", () => (
    <TextClassification
      containerProps={{ requireCompleteToPressNext: true }}
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      interface={{
        type: "text_classification",
        description: "Classify the person name into the correct house.",
        multiple: true,
        labels: [
          {
            id: "gryffindor",
            displayName: "Gryffindor",
            description: "Daring, strong nerve and chivalry."
          },
          {
            id: "slytherin",
            displayName: "Slytherin",
            description: "Cunning and ambitious. Possibly dark wizard."
          }
        ]
      }}
      taskData={[{ document: "Harry" }, { document: "Malfoy" }]}
      taskOutput={[{ label: "gryffindor" }, null]}
    />
  ))
