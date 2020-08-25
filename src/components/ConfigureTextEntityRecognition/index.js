import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    // TODO uncomment when description can be seen in the interface somewhere
    // {
    //   name: "description",
    //   title: "Description",
    //   type: "multiline-text",
    // },
    // TODO enable when we support overlap
    // {
    //   name: "overlapAllowed",
    //   title: "Overlap Allowed",
    //   type: "boolean",
    // },
    {
      name: "labels",
      title: "Labels",
      type: "matrixdynamic",
      hasOther: true,
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
      description: iface.description,
      overlapAllowed: Boolean(
        iface.overlapAllowed || iface.overlapAllowed === undefined
      ),
      labels: (iface.labels || []).map((column) =>
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
