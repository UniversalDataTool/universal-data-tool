// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import UniversalDataViewer from "./"

storiesOf("UniversalDataViewer", module).add("Basic", () => (
  <UniversalDataViewer
    hideHeader
    oha={{
      interface: {
        type: "text_entity_recognition",
        description: "Label words or phrases as food or hat.",
        overlapAllowed: false,
        labels: [
          {
            id: "food",
            displayName: "Food",
            description: "Edible item."
          },
          {
            id: "hat",
            displayName: "Hat",
            description: "Something worn on the head."
          }
        ]
      },
      taskData: [
        {
          document:
            "This strainer makes a great hat, I'll wear it while I serve spaghetti!"
        }
      ],
      taskOutput: [
        {
          entities: [
            { label: "hat", text: "strainer", start: 5, end: 13 },
            { label: "food", text: "spaghetti", start: 59, end: 68 }
          ]
        }
      ]
    }}
  />
))
