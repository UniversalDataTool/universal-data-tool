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
  polygon: ["create-polygon", "create-expanding-line"],
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

  const [selectedIndex, changeSelectedIndex] = useState(0)
  const [showTags, changeShowTags] = useState(true)
  const [selectedTool, changeSelectedTool] = useState("select")

  const { regionTypesAllowed = ["bounding-box"] } = iface

  const isClassification = !Boolean(iface.multipleRegionLabels)
  const isPixel = iface.type === "image_pixel_segmentation"

  const saveCurrentIndexAnnotation = useEventCallback((output) => {
    const img = output.images[selectedIndex]
    onSaveTaskOutputItem(
      selectedIndex,
      multipleRegions
        ? (img.regions || []).map(convertFromRIARegionFmt)
        : convertToRIAImageFmt((img.regions || [])[0])
    )
  })

  const labelProps = useMemo(
    () =>
      isPixel
        ? {
            regionClsList: ["background"]
              .concat(iface.labels || [])
              .map((l) => (typeof l === "string" ? l : l.id)),
          }
        : isClassification
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
    [isClassification, iface.labels, isPixel]
  )

  const multipleRegions =
    iface.multipleRegions || iface.multipleRegions === undefined

  const onExit = useEventCallback((output, nextAction) => {
    saveCurrentIndexAnnotation(output)
    changeShowTags(output.showTags)
    changeSelectedTool(output.selectedTool)
    if (containerProps.onExit) containerProps.onExit(nextAction)
  })
  const onNextImage = useEventCallback((output) => {
    if (selectedIndex + 1 >= samples.length) {
      onExit(output, "go-to-next")
    } else {
      saveCurrentIndexAnnotation(output)
      changeSelectedIndex(selectedIndex + 1)
    }
  })
  const onPrevImage = useEventCallback((output) => {
    if (selectedIndex - 1 < 0) {
      onExit(output, "go-to-previous")
    } else {
      saveCurrentIndexAnnotation(output)
      changeSelectedIndex(selectedIndex - 1)
    }
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

  const enabledTools =
    iface.type === "image_pixel_segmentation"
      ? undefined
      : useMemo(
          () =>
            ["select"].concat(
              regionTypesAllowed
                .flatMap((rt) => regionTypeToTool[rt])
                .filter(Boolean)
            ),
          [regionTypesAllowed]
        )

  const allowedArea = useMemo(() => {
    if (!iface.allowedArea && !samples[selectedIndex].allowedArea)
      return undefined
    const { x, y, width: w, height: h } =
      samples[selectedIndex].allowedArea || iface.allowedArea
    return { x, y, w, h }
    // eslint-disable-next-line
  }, [iface.allowedArea, samples[selectedIndex].allowedArea])

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
        fullImageSegmentationMode={isPixel}
        selectedImage={samples[selectedIndex].imageUrl}
        taskDescription={iface.description}
        showTags={showTags}
        {...labelProps}
        autoSegmentationOptions={iface.autoSegmentationEngine}
        allowedArea={allowedArea}
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
