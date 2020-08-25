import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "entityLabels",
      title: "Entity Labels",
      type: "matrixdynamic",
      columns: [
        {
          cellType: "text",
          name: "id",
          title: "ID",
        },
        {
          cellType: "text",
          name: "displayName",
          title: "Display Name",
        },
        {
          cellType: "text",
          name: "description",
          title: "Description",
        },
      ],
    },
    {
      name: "relationLabels",
      title: "Relation Labels",
      type: "matrixdynamic",
      columns: [
        {
          cellType: "text",
          name: "id",
          title: "ID",
        },
        {
          cellType: "text",
          name: "displayName",
          title: "Display Name",
        },
        {
          cellType: "text",
          name: "description",
          title: "Description",
        },
      ],
    },
  ],
}

export default ({ iface, onChange }) => {
  const defaultAnswers = useMemo(
    () => ({
      entityLabels: (iface.entityLabels || []).map((column) =>
        typeof column === "string"
          ? {
              id: column,
              displayName: column,
              description: column,
            }
          : column
      ),
      relationLabels: (iface.relationLabels || []).map((column) =>
        typeof column === "string"
          ? {
              id: column,
              displayName: column,
              description: column,
            }
          : column
      ),
    }),
    [iface]
  )
  return (
    <Survey
      noActions
      variant="flat"
      onQuestionChange={(questionId, newValue, answers) => {
        onChange(setIn(iface, [questionId], newValue))
      }}
      form={form}
      defaultAnswers={defaultAnswers}
    />
  )
}
