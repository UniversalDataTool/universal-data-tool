import React from "react"
import { Box, styled } from "@material-ui/core"

const ItemContainer = styled("div")({
  padding: 16,
  display: "flex",
})

const IconContainer = styled("div")({
  flexShrink: 0,
})

export const AuditTrail = () => {
  return (
    <Box>
      <ItemContainer>
        <IconContainer></IconContainer>
      </ItemContainer>
    </Box>
  )
}

export default AuditTrail
