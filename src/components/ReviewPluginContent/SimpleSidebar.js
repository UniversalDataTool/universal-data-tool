import React from "react"
import { Box, colors } from "@material-ui/core"
import SidebarItem from "./SidebarItem"

export const SimpleSidebar = ({
  children,
  sidebarItems,
  selectedItem,
  onSelectItem,
}) => {
  return (
    <Box display="flex">
      <Box
        flexShrink={0}
        width={200}
        display="flex"
        flexDirection="column"
        padding={4}
      >
        {sidebarItems.map((item) => (
          <SidebarItem
            selected={item.name === selectedItem}
            onClick={() => onSelectItem(item.name)}
          >
            {item.name}
          </SidebarItem>
        ))}
      </Box>
      <Box flexGrow={1} paddingTop={2}>
        {children}
      </Box>
    </Box>
  )
}

export default SimpleSidebar
