// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TextEntityRelations from "./"

storiesOf("TextEntityRelations", module)
  .add("Basic", () => (
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
      sample={{
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
            { text: "I'll", start: 33, end: 36, textId: "id3" },
            { text: "wear", start: 38, end: 41, textId: "id4" },
          ],
          relations: [{ from: "id3", to: "id4", label: "subject-doing" }],
        },
      }}
    />
  ))
  .add("Saving bug with relations (should not error)", () => (
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
            id: "subject",
            displayName: "Subject",
          },
          {
            id: "R1",
          },
        ],
      }}
      sample={{
        document: "This is something i'd like to do",
        annotation: {
          entities: [
            { text: "This", textId: "82tm4y", start: 0, end: 3 },
            { text: "something", textId: "gejze6", start: 8, end: 16 },
            { text: "d", textId: "ixwjg9", start: 20, end: 20 },
            { text: "to", textId: "r8ayjq", start: 27, end: 28 },
            { text: "do", textId: "wt3hbx", start: 30, end: 31 },
          ],
          relations: [
            {
              from: "82tm4y",
              to: "gejze6",
              label: "subject",
              color: "#d32f2f",
            },
            { from: "ixwjg9", to: "gejze6", label: "R1", color: "#c2185b" },
            {
              from: "r8ayjq",
              to: "gejze6",
              label: "subject",
              color: "#d32f2f",
            },
            { from: "ixwjg9", to: "wt3hbx", label: "R1", color: "#c2185b" },
            {
              from: "82tm4y",
              to: "gejze6",
              label: "subject",
              color: "#d32f2f",
            },
          ],
        },
      }}
    />
  ))
  .add("Should not combine entities", () => (
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
            id: "subject",
            displayName: "Subject",
          },
          {
            id: "R1",
          },
        ],
      }}
      sample={{
        document: "This is something i'd like to do",
        annotation: {
          entities: [
            {
              text: "This",
              textId: "this",
              start: 0,
              end: 3,
              label: "subject",
            },
            { text: " is", textId: "is", start: 4, end: 6, label: "subject" },
          ],
          relations: [],
        },
      }}
    />
  ))
