import React from "react"
import { styled } from "@material-ui/core/styles"
import ProgressBar from "../ProgressBar"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"

const ProgressContainer = styled("div")({
  width: "100%",
  height: "100%",
})

const TotalPercentageWrapper = styled("div")({
  flexDirection: "row",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
})

const Progress = ({ unitProgress, overallProgress, completedVideoTitles }) => {
  return (
    <ProgressContainer>
      <ProgressBar progress={overallProgress} />
      <ProgressBar progress={unitProgress.progress} />

      <h3>Downloading: {unitProgress.title}</h3>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <TotalPercentageWrapper>
            <h3>Downloaded Video Titles</h3>
          </TotalPercentageWrapper>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ul>
            {completedVideoTitles && completedVideoTitles.length > 0
              ? completedVideoTitles
              : null}
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ProgressContainer>
  )
}

export default Progress
