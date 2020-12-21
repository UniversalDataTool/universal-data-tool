import React, { useState, styled } from "react"
import { Box, colors } from "@material-ui/core"
import Title from "./Title"
import TeamTable from "./TeamTable"
import QualityContent from "./QualityContent"
import SimpleSidebar from "./SimpleSidebar"

const sidebarItems = [
  {
    name: "Team",
  },
  {
    name: "Quality",
  },
]

export const Settings = () => {
  const [selectedItem, setSelectedItem] = useState("Team")

  return (
    <SimpleSidebar
      sidebarItems={sidebarItems}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
    >
      <Title>{selectedItem}</Title>
      {selectedItem === "Team" && <TeamTable />}
      {selectedItem === "Quality" && <QualityContent />}
    </SimpleSidebar>
  )
}

export default Settings
