// @flow

import React, { useMemo } from "react"
import Annotator from "react-image-annotate"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import {
  convertFromRIARegionFmt,
  convertToRIAImageFmt,
} from "../../utils/ria-format.js"
import useClobberedState from "../../utils/use-clobbered-state"

const Container = styled("div")({
  "& .fullscreen": { height: "100%" },
})

const [emptyObj, emptyArr] = [{}, []]

const posingTools = ["create-keypoints"]

export default ({
  sampleIndex: globalSampleIndex,
  interface: iface,
  sampleIndex,
  samples = emptyArr,
  containerProps = emptyObj,
  onSaveTaskOutputItem,
  onModifySample,
}) => {
  const [selectedIndex, setSelectedIndex] = useClobberedState(
    globalSampleIndex,
    0
  )

  const saveCurrentIndexAnnotation = useEventCallback((output) => {
    const img = output.images[0]
    const annotation = (img.regions || []).map(convertFromRIARegionFmt)
    if (onModifySample) {
      onModifySample(selectedIndex, { annotation })
    } else {
      onSaveTaskOutputItem(selectedIndex, annotation)
    }
  })

  const onExit = useEventCallback((output, nextAction) => {
    saveCurrentIndexAnnotation(output)
    if (containerProps.onExit) containerProps.onExit(nextAction)
  })
  const onNextImage = useEventCallback((output) => {
    if (selectedIndex + 1 >= samples.length) {
      onExit(output, "go-to-next")
    } else {
      saveCurrentIndexAnnotation(output)
      if (setSelectedIndex) {
        setSelectedIndex(selectedIndex + 1)
      } else {
        onExit(output, "go-to-next")
      }
    }
  })
  const onPrevImage = useEventCallback((output) => {
    if (selectedIndex - 1 < 0) {
      onExit(output, "go-to-previous")
    } else {
      saveCurrentIndexAnnotation(output)
      if (setSelectedIndex) {
        setSelectedIndex(selectedIndex - 1)
      } else {
        onExit(output, "go-to-previous")
      }
    }
  })

  const singleImageList = useMemo(() => {
    return [
      convertToRIAImageFmt({
        title: containerProps.datasetName || `Sample ${selectedIndex}`,
        taskDatum: samples[selectedIndex],
        output: samples[selectedIndex].annotation,
        selectedIndex,
      }),
    ]
    // eslint-disable-next-line
  }, [selectedIndex, containerProps.datasetName])

  return (
    <Container
      style={{
        height: containerProps.height || "calc(100% - 70px)",
        minHeight: 600,
        width: "100%",
      }}
    >
      <Annotator
        key={globalSampleIndex}
        keypointDefinitions={iface.keypointDefinitions}
        selectedImage={0}
        taskDescription={iface.description}
        onNextImage={onNextImage}
        onPrevImage={onPrevImage}
        enabledTools={posingTools}
        images={singleImageList}
        onExit={onExit}
      />
    </Container>
  )
}
