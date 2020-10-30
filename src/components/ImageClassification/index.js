// @flow

import React, { useState, useEffect, useMemo } from "react"
import useEventCallback from "use-event-callback"
import { styled } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import * as colors from "@material-ui/core/colors"
import Checkbox from "@material-ui/core/Checkbox"
import without from "lodash/without"
import WorkspaceContainer from "../WorkspaceContainer"

const brightColors = [
  colors.blue[600],
  colors.green[600],
  colors.red[600],
  colors.deepOrange[600],
  colors.pink[600],
  colors.teal[600],
  colors.deepPurple[600],
  colors.indigo[600],
  colors.blue[600],
  colors.cyan[600],
  colors.purple[600],
]

const letters = "abcdefghijklmnopqrstuvwxyz1234567890".split("")
const getRandomColor = (label) => {
  const hashInt = label.id
    .split("")
    .reduce((acc, v, i) => acc + (letters.indexOf(v) + 1), 0)
  return brightColors[hashInt % brightColors.length]
}

const Container = styled("div")({
  maxWidth: "100vw",
  display: "flex",
  flexDirection: "column",
})

const ImageContainer = styled("div")({
  position: "relative",
  display: "flex",
  flexGrow: 1,
})

const Image = styled("img")({
  display: "inline-block",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
})

const ButtonsContainer = styled("div")({
  paddingLeft: 50,
  paddingRight: 50,
  marginTop: 8,
  textAlign: "center",
  flexShrink: 0,
})

const CheckButton = styled(Button)({
  margin: 8,
  color: "#fff",
  fontSize: 18,
  paddingRight: 16,
  transition: "transform 50ms ease",
})

const [emptyObj, emptyArr] = [{}, []]

export const ImageClassification = ({
  sampleIndex,
  interface: iface,
  sample,
  containerProps = emptyObj,
  onModifySample,
}) => {
  const disableHotkeys = containerProps.disableHotkeys

  if (!iface.labels)
    throw new Error("No labels defined. Add some labels in Setup to continue.")

  const [enlargedLabel, changeEnlargedLabel] = useState(null)
  const [currentOutput, changeCurrentOutput] = useState(emptyArr)
  const labels = useMemo(
    () =>
      iface.labels.map((l) =>
        typeof l === "string" ? { id: l, description: l } : l
      ),
    [iface.labels]
  )

  const onDone = useEventCallback((output) => {
    onModifySample({ ...sample, annotation: currentOutput })
    if (containerProps.onExit) containerProps.onExit()
  })
  const onNext = useEventCallback(() => {
    onModifySample({ ...sample, annotation: currentOutput })
    containerProps.onExit("go-to-next")
  })
  const onPrev = useEventCallback(() => {
    onModifySample({ ...sample, annotation: currentOutput })
    containerProps.onExit("go-to-previous")
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      changeEnlargedLabel(null)
    }, 100)
    return () => clearTimeout(timeout)
  }, [enlargedLabel])

  const onClickLabel = useEventCallback((label) => {
    changeEnlargedLabel(label)
    let newOutput
    if (
      typeof currentOutput !== "string" &&
      (currentOutput || []).includes(label.id)
    ) {
      newOutput = without(currentOutput, label.id)
    } else {
      if (iface.multiple) {
        newOutput = currentOutput.concat([label.id])
      } else {
        newOutput = label.id
      }
    }

    changeCurrentOutput(newOutput)
    if (!iface.multiple && newOutput.length > 0) {
      onModifySample({ ...sample, annotation: newOutput })
      containerProps.onExit("go-to-next")
    }
  })

  useEffect(() => {
    let newOutput = sample?.annotation
    if (!newOutput) newOutput = []
    if (typeof newOutput === "string") newOutput = [newOutput]
    changeCurrentOutput(newOutput)
  }, [sampleIndex, sample])

  const [hotkeyMap, labelKeyMap] = useMemo(() => {
    if (disableHotkeys) return [{}, {}]
    const hotkeyMap = {
      " ": onNext,
      backspace: onPrev,
      enter: onDone,
      rightarrow: onNext,
      leftarrow: onPrev,
    }
    const labelKeyMap = {}
    for (let label of labels) {
      const nextAvailableLetter = label.id
        .split("")
        .filter((l) => letters.includes(l))
        .find((l) => !hotkeyMap[l.toLowerCase()])
      if (!nextAvailableLetter) continue
      hotkeyMap[nextAvailableLetter] = () => onClickLabel(label)
      labelKeyMap[label.id] = nextAvailableLetter
    }
    return [hotkeyMap, labelKeyMap]
  }, [labels, onClickLabel, onDone, onNext, onPrev, disableHotkeys])

  useEffect(() => {
    if (disableHotkeys) return
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (hotkeyMap[key]) {
        hotkeyMap[key]()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [hotkeyMap, disableHotkeys])

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
        <ImageContainer>
          <Image src={sample?.imageUrl} />
        </ImageContainer>
        <ButtonsContainer>
          {labels.map((label) => (
            <CheckButton
              key={label.id}
              onClick={() => onClickLabel(label)}
              style={{
                backgroundColor: getRandomColor(label),
                transform:
                  enlargedLabel === label ? "scale(1.1,1.1)" : undefined,
              }}
            >
              <Checkbox
                style={{ color: "#fff" }}
                checked={
                  typeof currentOutput === "object"
                    ? currentOutput.includes(label.id)
                    : currentOutput === label.id
                }
              />
              {label.id}
              {labelKeyMap[label.id] ? ` (${labelKeyMap[label.id]})` : ""}
            </CheckButton>
          ))}
        </ButtonsContainer>
      </Container>
    </WorkspaceContainer>
  )
}

export default ImageClassification
