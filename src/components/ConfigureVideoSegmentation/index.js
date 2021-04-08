// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"
import { setIn } from "seamless-immutable"

const form = {
  questions: [
    {
      name: "regionTypesAllowed",
      title: "Region Types Allowed",
      description: "What types of regions can be drawn on the image.",
      type: "multiple-dropdown",
      choices: ["bounding-box", "polygon", "point", "ordered-point"],
    },
    {
      name: "multipleRegions",
      title: "Can multiple regions be created?",
      type: "boolean",
    },
    {
      name: "multipleRegionLabels",
      title: "Multiple Region Labels Allowed?",
      type: "boolean",
    },
    {
      name: "labels",
      title: "Labels",
      description:
        "If you're labeling regions on an video frames, these are the allowed classifications or tags.",
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
      multipleRegions: Boolean(
        iface.multipleRegions || iface.multipleRegions === undefined
      ),
      multipleRegionLabels: Boolean(iface.multipleRegionLabels),
      regionTypesAllowed: iface.regionTypesAllowed,
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
