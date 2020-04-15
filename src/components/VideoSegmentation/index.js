// @flow

import React, { useState, useEffect, useMemo } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Annotator from "react-image-annotate"
import isEqual from "lodash/isEqual"
import useEventCallback from "use-event-callback"
import {
  rid,
  convertFromRIARegionFmt,
  convertToRIARegionFmt,
  convertToRIAKeyframes,
} from "../../utils/ria-format.js"

const useStyles = makeStyles({})

const regionTypeToTool = {
  "bounding-box": "create-box",
  polygon: "create-polygon",
  "full-segmentation": "create-polygon",
  point: "create-point",
}

const [emptyObj, emptyArr] = [{}, []]

export default ({
  interface: iface,
  taskData = emptyArr,
  taskOutput = emptyObj,
  containerProps = emptyObj,
  onSaveTaskOutputItem,
}) => {
  const c = useStyles()
  const [selectedIndex, changeSelectedIndex] = useState(0)

  const { regionTypesAllowed = ["bounding-box"] } = iface

  const isClassification = !Boolean(iface.multipleRegionLabels)

  const labelProps = useMemo(
    () =>
      isClassification
        ? {
            regionClsList: (iface.availableLabels || []).map((l) =>
              typeof l === "string" ? l : l.id
            ),
          }
        : {
            regionTagList: (iface.availableLabels || []).map((l) =>
              typeof l === "string" ? l : l.id
            ),
          },
    [isClassification]
  )

  const multipleRegions =
    iface.multipleRegions || iface.multipleRegions === undefined

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
  if (taskData.length > 1) {
    return "Video segmentation is currently limited to only a single video per selection"
  }

  if (taskData.length === 0) throw new Error("No sample data provided selected")
  if (!taskData[0].videoUrl) throw new Error("Sample must have videoUrl")

  return (
    <div style={{ height: "calc(100vh - 70px)" }}>
      <Annotator
        taskDescription={iface.description}
        {...labelProps}
        enabledTools={enabledTools}
        keyframes={convertToRIAKeyframes(
          ((taskOutput || [])[0] || {}).keyframes
        )}
        videoName={taskData[0].customId || ""}
        videoTime={0}
        videoSrc={taskData[0].videoUrl}
        onExit={onExit}
      />
    </div>
  )
}
