// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DataEntry from "./"

storiesOf("DataEntry", module).add("Basic", () => (
  <DataEntry
    onSaveTaskOutputItem={action("onSaveTaskOutputItem")}
    interface={{
      type: "data_entry",
      description: "Some task description",
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
    }}
    taskData={[
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg"
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
      },
      {
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image3.jpg"
      }
    ]}
  />
))
