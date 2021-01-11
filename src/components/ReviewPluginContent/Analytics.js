import { Box } from "@material-ui/core"
import React from "react"
import TeamPerformanceTable from "./TeamPerformanceTitle"
import SimpleSidebar from "./SimpleSidebar"
import { colors } from "@material-ui/core"

export const Analytics = () => {
  return (
    <SimpleSidebar
      sidebarItems={[
        { name: "Performance Table" },
        { name: "Rejected Labels" },
      ]}
      selectedItem="Performance Table"
    >
      <Box
        p="32px"
        style={{ backgroundColor: colors.yellow[100] }}
        textAlign="center"
      >
        This page isn't ready yet
      </Box>
      <TeamPerformanceTable />
    </SimpleSidebar>
  )
}

export default Analytics
