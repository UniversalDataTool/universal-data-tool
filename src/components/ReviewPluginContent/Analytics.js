import React from "react"
import TeamPerformanceTable from "./TeamPerformanceTitle"
import SimpleSidebar from "./SimpleSidebar"

export const Analytics = () => {
  return (
    <SimpleSidebar
      sidebarItems={[
        { name: "Performance Table" },
        { name: "Rejected Labels" },
      ]}
      selectedItem="Performance Table"
    >
      <TeamPerformanceTable />
    </SimpleSidebar>
  )
}

export default Analytics
