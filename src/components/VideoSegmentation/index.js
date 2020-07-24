// @flow

import React, { useMemo } from "react"
import Annotator from "react-image-annotate"
import useEventCallback from "use-event-callback"
import {
  convertFromRIARegionFmt,
  convertToRIAKeyframes,
} from "../../utils/ria-format.js"

const regionTypeToTool = {
  "bounding-box": "create-box",
  polygon: "create-polygon",
  "full-segmentation": "create-polygon",
  point: "create-point",
}

const [emptyObj, emptyArr] = [{}, []]

export default ({
  interface: iface,
  samples = emptyArr,
  containerProps = emptyObj,
  onSaveTaskOutputItem,
}) => {
  const { regionTypesAllowed = ["bounding-box"] } = iface

  const isClassification = !Boolean(iface.multipleRegionLabels)

  const labelProps = useMemo(
    () =>
      isClassification
        ? {
            regionClsList: (iface.labels || []).map((l) =>
              typeof l === "string" ? l : l.id
            ),
          }
        : {
            regionTagList: (iface.labels || []).map((l) =>
              typeof l === "string" ? l : l.id
            ),
          },
    [isClassification, iface.labels]
  )

  const onExit = useEventCallback((output) => {
    const newKeyframes = {}
    for (const key in output.keyframes) {
      newKeyframes[key] = {
        regions: output.keyframes[key].regions.map(convertFromRIARegionFmt),
      }
    }
    onSaveTaskOutputItem(0, { keyframes: newKeyframes })
    if (containerProps.onExit) containerProps.onExit()
  })

  const enabledTools = useMemo(
    () =>
      ["select"].concat(
        regionTypesAllowed.map((rt) => regionTypeToTool[rt]).filter(Boolean)
      ),
    [regionTypesAllowed]
  )

  // TODO fix by adding some way of going to the "next" video
  if (samples.length > 1) {
    return "Video segmentation is currently limited to only a single video per selection"
  }

  if (samples.length === 0) throw new Error("No sample data provided selected")
  if (!samples[0].videoUrl) throw new Error("Sample must have videoUrl")

  const annotation = samples[0].annotation

  return (
    <div
      style={{
        height: containerProps.height || "calc(100vh - 70px)",
        width: "100%",
        minHeight: 600,
      }}
    >
      <Annotator
        taskDescription={iface.description}
        {...labelProps}
        enabledTools={enabledTools}
        keyframes={convertToRIAKeyframes(annotation?.keyframes || {})}
        videoName={samples[0].customId || ""}
        videoTime={0}
        videoSrc={samples[0].videoUrl}
        onExit={onExit}
      />
    </div>
  )
}
