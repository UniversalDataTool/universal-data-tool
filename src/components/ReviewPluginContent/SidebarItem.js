import React from "react"
import { styled, colors } from "@material-ui/core"

export const SidebarItem = styled("div")(({ selected }) => ({
  padding: 8,
  fontWeight: 500,
  color: selected ? colors.blue[600] : colors.grey[800],
  opacity: !selected ? 0.75 : 1,
  cursor: "pointer",
  "&:hover": {
    opacity: 1,
  },
}))

export default SidebarItem
