// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
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
      multiple: iface.multiple ? iface.multiple : false,
      labels:
        (iface.labels || []).map((a) => {
          return typeof a === "string" ? { id: a, description: a } : a
        }) || [],
    }),
    [iface.labels, iface.multiple]
  )
  return (
    <Survey
      noActions
      variant="flat"
      defaultAnswers={defaultAnswers}
      onQuestionChange={(questionId, newValue) => {
        var arrayId = []
        if (Array.isArray(newValue))
          newValue = newValue.filter((json) => {
            if (arrayId.includes(json.id)) return false
            arrayId.push(json.id)
            return true
          })
        onChange(setIn(iface, [questionId], newValue))
      }}
      form={form}
    />
  )
}
