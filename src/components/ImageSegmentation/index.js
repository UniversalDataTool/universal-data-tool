// @flow

import React, { useState, useMemo } from "react"
import Annotator from "react-image-annotate"
import useEventCallback from "use-event-callback"
import {
  convertFromRIARegionFmt,
  convertToRIAImageFmt,
} from "../../utils/ria-format.js"

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
  samples = emptyArr,
  containerProps = emptyObj,
  onSaveTaskOutputItem,
}) => {
  // TODO remove legacy "availableLabels" support
  if (iface.availableLabels && !iface.labels) {
    iface.labels = iface.availableLabels
  }

  const [selectedIndex] = useState(0)
  const [showTags, changeShowTags] = useState(true)
  const [selectedTool, changeSelectedTool] = useState("select")

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
    [isClassification, iface.availableLabels]
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
    changeShowTags(output.showTags)
    changeSelectedTool(output.selectedTool)
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
      samples.map((taskDatum, index) =>
        convertToRIAImageFmt({
          title: containerProps.datasetName,
          taskDatum,
          output: samples[index].annotation,
          index,
        })
      ),
    [samples, containerProps.datasetName]
  )

  const enabledTools = useMemo(
    () =>
      ["select"].concat(
        regionTypesAllowed.map((rt) => regionTypeToTool[rt]).filter(Boolean)
      ),
    [regionTypesAllowed]
  )

  return (
    <div
      style={{
        height: containerProps.height || "calc(100% - 70px)",
        minHeight: 600,
        width: "100%",
      }}
    >
      <Annotator
        key={globalSampleIndex}
        selectedImage={samples[selectedIndex].imageUrl}
        taskDescription={iface.description}
        showTags={showTags}
        {...labelProps}
        onNextImage={onNextImage}
        onPrevImage={onPrevImage}
        enabledTools={enabledTools}
        selectedTool={selectedTool}
        images={images}
        onExit={onExit}
      />
    </div>
  )
}
