// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "multiple",
      title: "Allow multiple classifications per image?",
      type: "boolean",
    },
    {
      name: "labels",
      title: "Labels",
      description: "Classifications or tags to be labeled.",
      type: "matrixdynamic",
      columns: [
        { cellType: "text", name: "id", title: "id" },
        {
          cellType: "text",
          name: "description",
          title: "Description (optional)",
        },
      ],
    },
  ],
}

export default ({ iface, onChange }) => {
  const defaultAnswers = useMemo(
    () => ({
      allowMultiple: false,
      labels:
        (iface.labels || []).map((a) =>
          typeof a === "string" ? { id: a, description: a } : a
        ) || [],
    }),
    []
  )
  return (
    <Survey
      noActions
      variant="flat"
      defaultAnswers={defaultAnswers}
      onQuestionChange={(questionId, newValue, answers) => {
        onChange(setIn(iface, [questionId], newValue))
      }}
      form={form}
    />
  )
}
