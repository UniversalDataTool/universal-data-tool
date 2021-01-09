import React, { useState, useMemo, styled } from "react"
import { useRecoilValue } from "recoil"
import { Box, colors } from "@material-ui/core"
import Title from "./Title"
import TeamTable from "./TeamTable"
import QualityContent from "./QualityContent"
import SimpleSidebar from "./SimpleSidebar"
import AdminSettings from "./AdminSettings"
import { userAtom } from "udt-review-hooks"

export const Settings = () => {
  const user = useRecoilValue(userAtom)

  const sidebarItems = useMemo(
    () =>
      [
        user.role.toLowerCase() === "admin" && {
          name: "Admin",
        },
        {
          name: "Team",
        },
        {
          name: "Quality",
        },
      ].filter(Boolean),
    []
  )
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].name)

  return (
    <SimpleSidebar
      sidebarItems={sidebarItems}
      onSelectItem={setSelectedItem}
      selectedItem={selectedItem}
    >
      <Title>{selectedItem}</Title>
      {selectedItem === "Admin" && <AdminSettings />}
      {selectedItem === "Team" && <TeamTable />}
      {selectedItem === "Quality" && <QualityContent />}
    </SimpleSidebar>
  )
}

export default Settings
