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
  "ordered-point": "create-ordered-point",
}

const emptyObj = {}

export default ({
  interface: iface,
  sampleIndex,
  sample,
  containerProps = emptyObj,
  onModifySample,
}) => {
  const { regionTypesAllowed = ["bounding-box"] } = iface

  const isClassification = !Boolean(iface?.multipleRegionLabels)

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

  const getUDTKeyFrames = (riaOutput) => {
    const newKeyframes = {}
    for (const key in riaOutput.keyframes) {
      newKeyframes[key] = {
        regions: riaOutput.keyframes[key].regions.map(convertFromRIARegionFmt),
      }
    }
    return newKeyframes
  }

  const onExit = useEventCallback((output) => {
    const annotation = { keyframes: getUDTKeyFrames(output) }
    onModifySample({ ...sample, annotation })
    if (containerProps.onExit) containerProps.onExit()
  })

  const onNext = useEventCallback((output) => {
    const annotation = { keyframes: getUDTKeyFrames(output) }
    onModifySample({ ...sample, annotation })
    if (containerProps.onExit) {
      containerProps.onExit("go-to-next")
    }
  })

  const onPrev = useEventCallback((output) => {
    const annotation = { keyframes: getUDTKeyFrames(output) }
    onModifySample({ ...sample, annotation })
    if (containerProps.onExit) {
      containerProps.onExit("go-to-previous")
    }
  })

  const enabledTools = useMemo(
    () =>
      ["select"].concat(
        regionTypesAllowed.map((rt) => regionTypeToTool[rt]).filter(Boolean)
      ),
    [regionTypesAllowed]
  )

  if (!sample) throw new Error("No sample data provided selected")
  if (!sample.videoUrl) throw new Error("Sample must have videoUrl")

  const annotation = sample.annotation || {}

  return (
    <div
      style={{
        height: containerProps.height || "calc(100vh - 70px)",
        width: "100%",
        minHeight: 600,
      }}
    >
      <Annotator
        key={sampleIndex}
        taskDescription={iface.description}
        {...labelProps}
        enabledTools={enabledTools}
        keyframes={convertToRIAKeyframes(annotation?.keyframes || {})}
        onNextImage={onNext}
        onPrevImage={onPrev}
        videoName={sample.customId || ""}
        videoTime={0}
        videoSrc={sample.videoUrl}
        onExit={onExit}
      />
    </div>
  )
}
