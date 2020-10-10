// @flow

import React, { useMemo } from "react"
import Annotator from "react-image-annotate"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import {
  convertFromRIARegionFmt,
  convertToRIAImageFmt,
} from "../../utils/ria-format.js"

const Container = styled("div")({
  "& .fullscreen": { height: "100%" },
})

const emptyObj = {}

const posingTools = ["create-keypoints"]

export default ({
  sampleIndex: globalSampleIndex,
  interface: iface,
  sampleIndex,
  sample,
  containerProps = emptyObj,
  onModifySample,
}) => {
  const saveCurrentIndexAnnotation = useEventCallback((output) => {
    const img = output.images[0]
    const annotation = (img.regions || []).map(convertFromRIARegionFmt)
    onModifySample({ ...sample, annotation })
  })

  const onExit = useEventCallback((output, nextAction) => {
    saveCurrentIndexAnnotation(output)
    if (containerProps.onExit) containerProps.onExit(nextAction)
  })
  const onNextImage = useEventCallback((output) => {
    saveCurrentIndexAnnotation(output)
    onExit(output, "go-to-next")
  })
  const onPrevImage = useEventCallback((output) => {
    saveCurrentIndexAnnotation(output)
    onExit(output, "go-to-previous")
  })

  const singleImageList = useMemo(() => {
    if (!sample) return []
    return [
      convertToRIAImageFmt({
        title: containerProps.title || `Sample ${sampleIndex}`,
        taskDatum: sample,
        output: sample?.annotation,
      }),
    ]
    // eslint-disable-next-line
  }, [sampleIndex, containerProps.title])

  return (
    <Container
      style={{
        height: containerProps.height || "calc(100% - 70px)",
        minHeight: 600,
        width: "100%",
      }}
    >
      {!sample ? (
        "loading..."
      ) : (
        <Annotator
          key={sampleIndex}
          keypointDefinitions={iface.keypointDefinitions}
          selectedImage={0}
          taskDescription={iface.description}
          onNextImage={onNextImage}
          onPrevImage={onPrevImage}
          enabledTools={posingTools}
          images={singleImageList}
          onExit={onExit}
        />
      )}
    </Container>
  )
}
