import React from "react"
import TeamPerformanceTable from "./TeamPerformanceTitle"
import SimpleSidebar from "./SimpleSidebar"

export const Analytics = () => {
  return (
    <SimpleSidebar
      sidebarItems={[{ name: "Performance Table" }]}
      selectedItem="Performance Table"
    >
      <TeamPerformanceTable />
    </SimpleSidebar>
  )
}

export default Analytics
