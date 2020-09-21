// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TextEntityRecognition from "./"

storiesOf("TextEntityRecognition", module).add("Basic", () => (
  <TextEntityRecognition
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    interface={{
      type: "text_entity_recognition",
      description: "Label words or phrases as food or hat.",
      overlapAllowed: false,
      labels: [
        {
          id: "food",
          displayName: "Food",
          description: "Edible item.",
        },
        {
          id: "hat",
          displayName: "Hat",
          description: "Something worn on the head.",
        },
      ],
    }}
    samples={[
      {
        document:
          "This strainer makes a great hat, I'll wear it while I serve spaghetti!",
        annotation: {
          entities: [
            { text: "strainer", label: "hat", start: 5, end: 13 },
            { text: "spaghetti", label: "food", start: 60, end: 69 },
          ],
        },
      },
    ]}
  />
))

storiesOf("TextEntityRecognition", module).add("Long Text", () => (
  <TextEntityRecognition
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    interface={{
      type: "text_entity_recognition",
      description: "Label words or phrases as food or hat.",
      overlapAllowed: false,
      labels: [
        {
          id: "food",
          displayName: "Food",
          description: "Edible item.",
        },
        {
          id: "hat",
          displayName: "Hat",
          description: "Something worn on the head.",
        },
      ],
    }}
    samples={[
      {
        document:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        annotation: {
          entities: [],
        },
      },
    ]}
  />
))
