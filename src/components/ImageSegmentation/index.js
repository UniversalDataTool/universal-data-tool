// @flow

import React, { useState, useMemo } from "react"
import Annotator from "react-image-annotate"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import {
  convertFromRIARegionFmt,
  convertToRIAImageFmt,
} from "../../utils/ria-format.js"

const regionTypeToTool = {
  "bounding-box": "create-box",
  polygon: ["create-polygon", "create-expanding-line"],
  point: "create-point",
  "allowed-area": "modify-allowed-area",
}

const Container = styled("div")({
  "& .fullscreen": { height: "100%" },
})

const emptyObj = {}

export default ({
  sampleIndex,
  interface: iface,
  sample,
  containerProps = emptyObj,
  onModifySample,
}) => {
  const [showTags, changeShowTags] = useState(true)
  const [selectedTool, changeSelectedTool] = useState("select")

  const { regionTypesAllowed = ["bounding-box"] } = iface

  const isClassification = !Boolean(iface?.multipleRegionLabels)
  const isPixel = iface?.type === "image_pixel_segmentation"

  const saveCurrentIndexAnnotation = useEventCallback((output) => {
    const img = output.images[0]
    const annotation = multipleRegions
      ? (img.regions || []).map(convertFromRIARegionFmt)
      : convertToRIAImageFmt((img.regions || [])[0])
    const { x, y, w: width, h: height } = output.allowedArea || {}

    onModifySample({
      ...sample,
      annotation,
      ...(output.allowedArea
        ? {
            allowedArea: { x, y, width, height },
          }
        : {}),
    })
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
    containerProps.onExit(nextAction)
  })

  const onNextImage = useEventCallback((output) => onExit(output, "go-to-next"))
  const onPrevImage = useEventCallback((output) =>
    onExit(output, "go-to-previous")
  )

  const singleImageList = useMemo(() => {
    return [
      convertToRIAImageFmt({
        title: containerProps.title || `Sample ${sampleIndex}`,
        taskDatum: sample,
        output: sample.annotation,
        selectedIndex: sampleIndex,
      }),
    ]
    // eslint-disable-next-line
  }, [sampleIndex, containerProps.title])

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
    if (!iface.allowedArea && !sample?.allowedArea)
      return { x: 0, y: 0, w: 1, h: 1 }
    const { x, y, width: w, height: h } =
      sample?.allowedArea || iface?.allowedArea
    return { x, y, w, h }
    // eslint-disable-next-line
  }, [iface.allowedArea, sample?.allowedArea])

  return (
    <Container
      style={{
        height: containerProps.height || "calc(100% - 70px)",
        minHeight: 600,
        width: "100%",
      }}
    >
      <Annotator
        key={sampleIndex}
        fullImageSegmentationMode={isPixel}
        selectedImage={0}
        taskDescription={iface.description}
        hideNext={containerProps.hideNext}
        hidePrev={containerProps.hidePrev}
        hideHeader={containerProps.hideHeader}
        hideHeaderText={containerProps.hideHeaderText}
        showTags={showTags}
        {...labelProps}
        autoSegmentationOptions={iface.autoSegmentationEngine}
        allowedArea={allowedArea}
        onNextImage={onNextImage}
        onPrevImage={onPrevImage}
        enabledTools={enabledTools}
        selectedTool={selectedTool}
        images={singleImageList}
        onExit={onExit}
      />
    </Container>
  )
}
