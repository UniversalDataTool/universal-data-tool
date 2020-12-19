import React from "react"
import { styled, colors } from "@material-ui/core"
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects"

const Container = styled("div")({
  "& .icon": {
    width: 64,
    height: 64,
  },
})
const Text = styled("div")({
  fontSize: 24,
  color: colors.grey[500],
})

export const Protip = ({ tip }) => (
  <Container>
    <EmojiObjectsIcon className="icon" />
    <Text>{tip}</Text>
  </Container>
)

export default Protip
