// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DataEntry from "./"

storiesOf("DataEntry", module)
  .add("Basic", () => (
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
                      text: "A",
                    },
                    {
                      value: "B",
                      text: "B",
                    },
                    {
                      value: "C",
                      text: "C",
                    },
                  ],
                },
                {
                  type: "text",
                  name: "feedback",
                  title: "Feedback",
                },
              ],
            },
          ],
        },
      }}
      samples={[
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image3.jpg",
        },
      ]}
    />
  ))
  .add("Prefilled Values", () => (
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
                      text: "A",
                    },
                    {
                      value: "B",
                      text: "B",
                    },
                    {
                      value: "C",
                      text: "C",
                    },
                  ],
                },
                {
                  type: "text",
                  name: "feedback",
                  title: "Feedback",
                },
              ],
            },
          ],
        },
      }}
      samples={[
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
          annotation: { group_letter: "A", feedback: "some feedback here" },
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg",
        },
        {
          imageUrl:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image3.jpg",
        },
      ]}
    />
  ))
  .add("PDF Url", () => (
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
                  type: "text",
                  name: "title",
                  title: "Name of Article",
                },
              ],
            },
          ],
        },
      }}
      samples={[
        {
          pdfUrl: "https://arxiv.org/pdf/1608.04481v1.pdf",
          annotation: { group_letter: "A", feedback: "some feedback here" },
        },
      ]}
    />
  ))
