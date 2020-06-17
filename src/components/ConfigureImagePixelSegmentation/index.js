// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "labels",
      title: "Available Labels",
      description:
        "If you're labeling regions on an image, these are the allowed classifications or tags.",
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
    {
      name: "description",
      title: "Sidebar Description",
      description: "Any instructions or notes in markdown.",
      type: "text",
    },
  ],
}

export default ({ iface, onChange }) => {
  const defaultAnswers = useMemo(
    () => ({
      description: iface.description,
      labels:
        (iface.labels || []).map((a) =>
          typeof a === "string" ? { id: a, description: a } : a
        ) || [],
    }),
    [iface]
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
