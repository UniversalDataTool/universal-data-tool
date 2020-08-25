// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TextEntityRelations from "./"

storiesOf("TextEntityRelations", module).add("Basic", () => (
  <TextEntityRelations
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    onExit={action("onExit")}
    interface={{
      type: "text_entity_recognition",
      description: "Label words or phrases as food or hat.",
      overlapAllowed: false,
      entityLabels: [
        {
          id: "food",
          displayName: "Food",
        },
        {
          id: "hat",
          displayName: "Hat",
        },
      ],
      relationLabels: [
        {
          id: "subject-doing",
          displayName: "Subject Doing",
        },
      ],
    }}
    samples={[
      {
        document:
          "This strainer makes a great hat, I'll wear it while I serve spaghetti!",
        annotation: {
          entities: [
            {
              text: "strainer",
              label: "hat",
              start: 5,
              end: 13,
              textId: "id1",
            },
            {
              text: "spaghetti",
              label: "food",
              start: 60,
              end: 69,
              textId: "id2",
            },
            { text: "I'll", start: 32, end: 36, textId: "id3" },
            { text: "wear", start: 37, end: 41, textId: "id4" },
          ],
          relations: [{ from: "id3", to: "id4", label: "subject-doing" }],
        },
      },
    ]}
  />
))
