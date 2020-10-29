import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { asMutable } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "enabledTools",
      title: "Enabled Tools",
      type: "multiple-dropdown",
      choices: [
        "create-durations",
        "label-durations",
        "create-timestamps",
        "label-timestamps",
      ],
    },
    {
      name: "timeFormat",
      title: "Time Format",
      type: "dropdown",
      choices: ["dates", "none", "duration"],
    },
    {
      name: "allowCustomLabels",
      title: "Allow Custom Labels",
      type: "boolean",
    },
    {
      name: "durationLabels",
      title: "Duration Labels",
      type: "matrixdynamic",
      columns: [{ cellType: "text", name: "id", title: "id" }],
    },
    {
      name: "timestampLabels",
      title: "Timestamp Labels",
      type: "matrixdynamic",
      columns: [{ cellType: "text", name: "id", title: "id" }],
    },
    {
      name: "graphs",
      title: "Graphs",
      type: "matrixdynamic",
      columns: [
        { cellType: "text", name: "keyName", title: "Key Name" },
        { cellType: "text", name: "row", title: "Row (optional)" },
        { cellType: "text", name: "color", title: "Color (optional)" },
      ],
    },
  ],
}

export default ({ iface, onChange }) => {
  const defaultAnswers = useMemo(
    () =>
      asMutable(
        {
          ...iface,
          durationLabels: (iface.durationLabels || []).map((a) => ({ id: a })),
          timestampLabels: (iface.timestampLabels || []).map((a) => ({
            id: a,
          })),
          graphs: (iface.graphs || []).map((a) => ({
            ...a,
            ...(a.row !== null && a.row !== undefined
              ? { row: a.row.toString() }
              : {}),
          })),
        },
        { deep: true }
      ),
    [iface]
  )
  return (
    <Survey
      noActions
      variant="flat"
      onQuestionChange={(questionId, newValue, answers) => {
        if (
          questionId === "durationLabels" ||
          questionId === "timestampLabels"
        ) {
          if (newValue.length === 0) {
            newValue = undefined
          } else {
            newValue = newValue.map((a) => a.id)
          }
        }
        if (questionId === "graphs") {
          newValue = newValue.map((graphRow) => ({
            ...graphRow,
            row: graphRow.row ? parseInt(graphRow.row) : undefined,
          }))
        }
        if (newValue.value) {
          onChange({ ...iface, [questionId]: newValue.value })
        } else {
          onChange({ ...iface, [questionId]: newValue })
        }
      }}
      form={form}
      defaultAnswers={defaultAnswers}
    />
  )
}
