import React from "react"
import { Box, styled, colors } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import ComputerIcon from "@material-ui/icons/Computer"
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications"
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle"

const ItemContainer = styled("div")({
  padding: 16,
  margin: 8,
  alignItems: "center",
  fontSize: 12,
  display: "flex",
  border: "1px solid #ccc",
  "& .icon": {
    marginRight: 16,
    width: 18,
    height: 18,
  },
  cursor: "pointer",
  transition: "border-left 80ms ease,padding-right 80ms ease",
  "&.selected": {
    borderLeft: `4px solid ${colors.blue[500]}`,
    paddingRight: 13,
  },
  "&:hover": {
    borderLeft: `4px solid ${colors.blue[500]}`,
  },
})

const ItemText = styled("div")({})

const items = [
  {
    text: "Billy Acosta labeled this item with 4 bounding boxes.",
    type: "label",
  },
  { text: "System has selected Billy Acosta's labels", type: "system" },
  { text: "Michael Reynolds labeled this item no labels.", type: "label" },
  {
    text: "System has selected Michael Reynolds's labels (91.4% > 87.7%)",
    type: "system",
  },
  { text: "Mary Pack has confirmed Michael Reynold's labels.", type: "review" },
]

const getIcon = (type) => {
  switch (type) {
    case "label": {
      return <EditIcon className="icon" style={{ color: colors.blue[500] }} />
    }
    case "system": {
      return (
        <SettingsApplicationsIcon
          className="icon"
          style={{ color: colors.grey[500] }}
        />
      )
    }
    case "review": {
      return (
        <SupervisedUserCircleIcon
          className="icon"
          style={{ color: colors.green[500] }}
        />
      )
    }
    default: {
    }
  }
}

export const AuditTrail = () => {
  return (
    <Box>
      {items.map((item, i) => (
        <ItemContainer key={i} className={i === items.length - 1 && "selected"}>
          {getIcon(item.type)}
          <ItemText>{item.text}</ItemText>
        </ItemContainer>
      ))}
    </Box>
  )
}

export default AuditTrail
