// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "allowMultiple",
      title: "Allow multiple classifications per image?",
      type: "boolean"
    },
    {
      name: "availableLabels",
      title: "Available Labels",
      description: "Classifications or tags to be labeled.",
      type: "matrixdynamic",
      columns: [
        { cellType: "text", name: "id", title: "id" },
        {
          cellType: "text",
          name: "description",
          title: "Description (optional)"
        }
      ]
    }
  ]
}

export default ({ iface, onChange }) => {
  const defaultAnswers = useMemo(
    () => ({
      allowMultiple: false,
      availableLabels:
        (iface.availableLabels || []).map(a =>
          typeof a === "string" ? { id: a, description: a } : a
        ) || []
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
