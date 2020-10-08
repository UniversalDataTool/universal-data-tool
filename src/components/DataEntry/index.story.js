// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DataEntry from "./"

storiesOf("DataEntry", module)
  .add("Basic", () => (
    <DataEntry
      sampleIndex={0}
      containerProps={{ totalSamples: 1 }}
      onModifySample={action("onModifySample")}
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
      sample={{
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
      }}
    />
  ))
  .add("Prefilled Values", () => (
    <DataEntry
      sampleIndex={0}
      containerProps={{ totalSamples: 1 }}
      onModifySample={action("onModifySample")}
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
      sample={{
        imageUrl:
          "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
        annotation: { group_letter: "A", feedback: "some feedback here" },
      }}
    />
  ))
  .add("PDF Url", () => (
    <DataEntry
      onModifySample={action("onModifySample")}
      sampleIndex={0}
      containerProps={{ totalSamples: 1 }}
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
      sample={{
        pdfUrl: "https://arxiv.org/pdf/1608.04481v1.pdf",
        annotation: { group_letter: "A", feedback: "some feedback here" },
      }}
    />
  ))
