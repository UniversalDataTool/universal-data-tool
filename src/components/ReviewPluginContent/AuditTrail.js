import React from "react"
import { CircularProgress, Box, styled, colors } from "@material-ui/core"
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

const getIcon = (type) => {
  switch (type) {
    case "label":
    case "work": {
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
    case "work_review":
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

export const AuditTrail = ({ selectedItem, items, onSelectItem }) => {
  if (!items)
    return (
      <Box textAlign="center" p="32px">
        <CircularProgress size={20} />
      </Box>
    )
  return (
    <Box>
      {items.map((item, i) => (
        <ItemContainer
          onClick={() => onSelectItem(item)}
          key={i}
          className={selectedItem === item && "selected"}
        >
          {getIcon(item.type)}
          {item.type === "work" && (
            <ItemText>{item.worker_name} submitted labels</ItemText>
          )}
          {item.type === "work_review" && (
            <ItemText>
              {item.reviewer_name} {item.accept_work ? "accepted" : "rejected"}{" "}
              labels from {item.worker_name}
            </ItemText>
          )}
          {item.type === "system" && <ItemText>{item.message}</ItemText>}
        </ItemContainer>
      ))}
    </Box>
  )
}

export default AuditTrail
