import React from "react"
import { styled, colors, Box } from "@material-ui/core"
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects"

const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: 32,
  paddingLeft: 64,
  paddingRight: 64,
  "& .icon": {
    width: 32,
    height: 32,
    color: colors.grey[500],
  },
})
const Text = styled("div")({
  fontSize: 18,
  paddingLeft: 8,
  color: colors.grey[500],
})

export const Protip = ({ tip }) => (
  <Container>
    <Box flexGrow={1} />
    <EmojiObjectsIcon className="icon" />
    <Text>{tip}</Text>
    <Box flexGrow={1} />
  </Container>
)

export default Protip
