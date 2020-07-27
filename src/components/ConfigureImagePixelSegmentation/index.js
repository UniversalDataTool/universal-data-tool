// @flow
import React, { useMemo } from "react"
import Survey from "material-survey/components/Survey"

const maxClusterPresets = {
  low: 1000,
  medium: 8000,
  high: 64000,
}
const maxClusterPresetsRev = Object.entries(maxClusterPresets).reduce(
  (acc, curr) => {
    acc[curr[1]] = curr[0]
    return acc
  },
  {}
)

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
      name: "autosegMode",
      type: "dropdown",
      title: "Automatic Segmentation Engine",
      choices: ["simple", "autoseg"],
    },
    {
      name: "autosegPreset",
      type: "dropdown",
      visibleIf: "{autosegMode}='autoseg'",
      title: "Super Pixel Quality",
      choices: ["low", "medium", "high", "custom"],
    },
    {
      name: "autosegMaxClusters",
      type: "slider",
      visibleIf: "{autosegPreset}='custom'",
      title: "Total Super Pixels",
      min: 10,
      max: 100000,
      step: 10,
      defaultValue: 1000,
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
      autosegMode: iface.autoSegmentationEngine?.mode,
      autosegPreset:
        maxClusterPresetsRev[
          iface.autoSegmentationEngine?.maxClusters || 1000
        ] || "custom",
      autosegMaxClusters: iface.autoSegmentationEngine?.maxClusters || 1000,
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
          onChange({
            ...iface,
            description: answers.description,
            labels: answers.labels,
            autoSegmentationEngine: {
              mode: answers.autosegMode,
              maxClusters:
                answers.autosegPreset === "custom"
                  ? answers.autosegMaxClusters
                  : maxClusterPresets[answers.autosegPreset],
            },
          })
        }}
        form={form}
      />
    </>
  )
}
