// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import UniversalDataViewer from "./"

storiesOf("UniversalDataViewer", module)
  .add("NLP", () => (
    <UniversalDataViewer
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
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
  .add("Data Entry", () => (
    <UniversalDataViewer
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      hideHeader
      oha={{
        interface: {
          type: "data_entry",
          description: "",
          surveyjs: {
            pages: [
              {
                name: "page1",
                elements: [
                  {
                    type: "radiogroup",
                    name: "group_letter",
                    title: "Group Letter",
                    choices: [
                      {
                        value: "A",
                        text: "A"
                      },
                      {
                        value: "B",
                        text: "B"
                      },
                      {
                        value: "C",
                        text: "C"
                      }
                    ]
                  },
                  {
                    type: "text",
                    name: "feedback",
                    title: "Feedback"
                  }
                ]
              }
            ]
          }
        },
        taskData: [
          {
            description: "Cucumber"
          }
        ],
        taskOutput: [
          {
            group_letter: "A",
            feedback: "this is some feedback"
          }
        ]
      }}
    />
  ))
  .add("Composite", () => (
    <UniversalDataViewer
      onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
      hideHeader
      oha={{
        interface: {
          type: "composite",
          fields: [
            {
              type: "data_entry",
              description: "",
              surveyjs: {
                pages: [
                  {
                    name: "page1",
                    elements: [
                      {
                        type: "radiogroup",
                        name: "group_letter",
                        title: "Group Letter",
                        choices: [
                          {
                            value: "A",
                            text: "A"
                          },
                          {
                            value: "B",
                            text: "B"
                          },
                          {
                            value: "C",
                            text: "C"
                          }
                        ]
                      },
                      {
                        type: "text",
                        name: "feedback",
                        title: "Feedback"
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        taskData: [
          {
            description: "Cucumber"
          },
          {
            description: "Hat"
          },
          {
            description: "Something"
          }
        ],
        taskOutput: [
          {
            group_letter: "A",
            feedback: "this is some feedback"
          },
          null,
          null
        ]
      }}
    />
  ))
