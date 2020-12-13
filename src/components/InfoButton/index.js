import React, { useState } from "react"
import { styled } from "@material-ui/core"
import InfoIcon from "@material-ui/icons/Info"
import IconButton from "@material-ui/core/IconButton"
import HeaderPopupBox from "../HeaderPopupBox"
import TextField from "@material-ui/core/TextField"
import EditableTitleText from "./EditableTitleText.js"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import useDatasetProperty from "../../hooks/use-dataset-property"
import { colors } from "@material-ui/core"

const Container = styled("div")({ position: "relative" })
const IconButtonStyle = styled(IconButton)({
  color: colors.grey[300],
})

export const InfoButton = () => {
  const [sessionBoxOpen, setSessionBoxOpen] = useState(false)
  const [dm] = useActiveDatasetManager()
  const { name, updateName } = useDatasetProperty("name")

  let shareURL
  if (dm.type === "collaborative-session") {
    shareURL = `${window.location.origin}?s=${dm.sessionId}`
  }

  return (
    <Container
      title="info-icon"
      onMouseEnter={() => setSessionBoxOpen(true)}
      onMouseLeave={() => setSessionBoxOpen(false)}
    >
      <IconButtonStyle>
        <InfoIcon />
      </IconButtonStyle>
      <HeaderPopupBox open={sessionBoxOpen}>
        <h1>Info</h1>
        {dm.type === "collaborative-session" ? (
          <TextField
            label="Share Link"
            title="share-link"
            value={shareURL}
            variant="outlined"
            size="small"
          />
        ) : (
          <EditableTitleText
            label="File Name"
            onChange={(newName) => {
              updateName(newName)
            }}
            value={name}
          />
        )}
      </HeaderPopupBox>
    </Container>
  )
}

export default InfoButton
