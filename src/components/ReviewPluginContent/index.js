import React, { useState } from "react"
import useEventCallback from "use-event-callback"
import { Tabs, Tab, Box, colors, styled } from "@material-ui/core"
import SettingsIcon from "@material-ui/icons/Settings"
import RateReviewIcon from "@material-ui/icons/RateReview"
import CreateIcon from "@material-ui/icons/Create"
import PollIcon from "@material-ui/icons/Poll"
import Settings from "./Settings"
import Review from "./Review"
import Label from "./Label"

const tabs = [
  { name: "Settings" },
  { name: "Review" },
  { name: "Label" },
  { name: "Analytics" },
]

const getIcon = (s) => {
  switch (s.toLowerCase()) {
    case "settings": {
      return <SettingsIcon className="icon" />
    }
    case "review": {
      return <RateReviewIcon className="icon" />
    }
    case "label": {
      return <CreateIcon className="icon" />
    }
    case "analytics": {
      return <PollIcon className="icon" />
    }
    default: {
      return null
    }
  }
}

export const ReviewPluginContent = () => {
  const [tab, setTab] = useState("review")
  const onChangeTab = useEventCallback((e, newTab) => {
    setTab(newTab)
  })
  return (
    <Box>
      <Tabs variant="fullWidth" onChange={onChangeTab} value={tab}>
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            icon={getIcon(tab.name)}
            label={tab.name}
            value={tab.name.toLowerCase()}
          />
        ))}
      </Tabs>
      {tab === "settings" && <Settings />}
      {tab === "review" && <Review />}
      {tab === "label" && <Label />}
    </Box>
  )
}

export default ReviewPluginContent
