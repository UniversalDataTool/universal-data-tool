// @flow

import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "multiple",
      title: "Allow Multiple Classifications",
      type: "boolean",
    },
    {
      name: "labels",
      title: "Labels",
      description: "Classifications or tags to be labeled.",
      type: "matrixdynamic",
      columns: [
        { cellType: "text", name: "id", title: "id" },
        { cellType: "text", name: "displayName", title: "Display Name" },
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
      multiple: false,
      labels:
        (iface.labels || []).map((a) =>
          typeof a === "string" ? { id: a, displayName: a, description: a } : a
        ) || [],
    }),
    [iface.labels]
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
