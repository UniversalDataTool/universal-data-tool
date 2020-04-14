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
  convertToRIAImageFmt,
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
  sampleIndex: globalSampleIndex,
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

  const onExit = useEventCallback((output, nextAction) => {
    const regionMat = (output.images || [])
      .map((img) => img.regions)
      .map((riaRegions) => (riaRegions || []).map(convertFromRIARegionFmt))

    for (let i = 0; i < regionMat.length; i++) {
      if (multipleRegions) {
        onSaveTaskOutputItem(i, regionMat[i])
      } else {
        onSaveTaskOutputItem(i, regionMat[i][0])
      }
    }
    if (containerProps.onExit) containerProps.onExit(nextAction)
  })
  const onNextImage = useEventCallback((output) => {
    onExit(output, "go-to-next")
  })
  const onPrevImage = useEventCallback((output) => {
    onExit(output, "go-to-previous")
  })

  const images = useMemo(
    () =>
      taskData.map((taskDatum, index) =>
        convertToRIAImageFmt({
          title: containerProps.datasetName,
          taskDatum,
          output: taskOutput[index],
          index,
        })
      ),
    [taskData]
  )

  const enabledTools = useMemo(
    () =>
      ["select"].concat(
        regionTypesAllowed.map((rt) => regionTypeToTool[rt]).filter(Boolean)
      ),
    [regionTypesAllowed]
  )

  return (
    <div style={{ height: "calc(100vh - 70px)" }}>
      <Annotator
        key={globalSampleIndex}
        selectedImage={taskData[selectedIndex].imageUrl}
        taskDescription={iface.description}
        {...labelProps}
        onNextImage={onNextImage}
        onPrevImage={onPrevImage}
        enabledTools={enabledTools}
        images={images}
        onExit={onExit}
      />
    </div>
  )
}
