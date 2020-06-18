// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const autoSegmentationOptions = {
  simple: { type: "simple" },
  autoseg: { type: "autoseg" },
}

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
    {
      name: "autoseg",
      type: "dropdown",
      title: "Automatic Segmentation Engine",
      choices: ["simple", "autoseg"],
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
      autoseg: iface.autoSegmentationEngine?.type,
    }),
    [iface]
  )
  return (
    <>
      <Survey
        noActions
        variant="flat"
        defaultAnswers={defaultAnswers}
        onQuestionChange={(questionId, newValue, answers) => {
          if (questionId === "autoseg") {
            onChange(
              setIn(
                iface,
                ["autoSegmentationEngine"],
                autoSegmentationOptions[newValue]
              )
            )
          } else {
            onChange(setIn(iface, [questionId], newValue))
          }
        }}
        form={form}
      />
    </>
  )
}
