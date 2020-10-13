import React, { useState } from "react"
import { styled } from "@material-ui/core"
import InfoIcon from "@material-ui/icons/Info"
import IconButton from "@material-ui/core/IconButton"
import HeaderPopupBox from "../HeaderPopupBox"
import TextField from "@material-ui/core/TextField"
import EditableTitleText from "./EditableTitleText.js"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"

const Container = styled("div")({ position: "relative" })

export const InfoButton = () => {
  const [sessionBoxOpen, setSessionBoxOpen] = useState(false)
  const [dm] = useActiveDatasetManager()
  window.dm = dm
  return (
    <Container
      title="info-icon"
      onMouseEnter={() => setSessionBoxOpen(true)}
      onMouseLeave={() => setSessionBoxOpen(false)}
    >
      <IconButton>
        <InfoIcon />
      </IconButton>
      <HeaderPopupBox open={sessionBoxOpen}>
        <h1>Info</h1>
        {dm.type === "collaborative-session" ? (
          <TextField
            label="Share Link"
            title="share-link"
            value={dm.sessionId}
            variant="outlined"
            size="small"
          />
        ) : (
          <EditableTitleText
            label="File Name"
            onChange={(newName) => {
              // onChangeFile(setIn(file, ["fileName"], newName))
              // setValueDisplay(newName)
            }}
            value={""}
          />
        )}
      </HeaderPopupBox>
    </Container>
  )
}

export default InfoButton
