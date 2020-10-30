// @flow

import React, { useState } from "react"
import useEventCallback from "use-event-callback"
import { styled } from "@material-ui/core/styles"
import WorkspaceContainer from "../WorkspaceContainer"
import ReactTimeSeries from "react-time-series"

const Container = styled("div")({
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
})

const [emptyObj] = [{}]

export const TimeSeries = ({
  sampleIndex,
  interface: iface,
  sample: sampleProp,
  containerProps = emptyObj,
  onModifySample: onModifySampleProp,
}) => {
  const [sample, setSample] = useState(sampleProp)

  const onDone = useEventCallback(() => {
    onModifySampleProp(sample)
    if (containerProps.onExit) containerProps.onExit()
  })
  const onNext = useEventCallback(() => {
    onModifySampleProp(sample)
    containerProps.onExit("go-to-next")
  })
  const onPrev = useEventCallback(() => {
    onModifySampleProp(sample)
    containerProps.onExit("go-to-previous")
  })

  return (
    <WorkspaceContainer
      {...containerProps}
      onNext={onNext}
      onPrev={onPrev}
      onRemoveSample={containerProps.onRemoveSample}
      onClickHeaderItem={onDone}
      currentSampleIndex={sampleIndex}
    >
      <Container
        style={{
          height: containerProps.height || "calc(100% - 70px)",
          minHeight: 600,
        }}
      >
        <ReactTimeSeries
          sample={sample}
          interface={iface}
          onModifySample={setSample}
        />
      </Container>
    </WorkspaceContainer>
  )
}

export default TimeSeries
