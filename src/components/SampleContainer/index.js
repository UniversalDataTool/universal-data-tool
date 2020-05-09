// @flow

import React, { useState } from "react"
import { makeStyles } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import ReactMarkdown from "react-markdown"
import RightIcon from "@material-ui/icons/KeyboardArrowRight"
import LeftIcon from "@material-ui/icons/KeyboardArrowLeft"
import CircleIcon from "@material-ui/icons/RadioButtonUnchecked"
import CheckCircle from "@material-ui/icons/CheckCircle"
import * as colors from "@material-ui/core/colors"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import LinkButton from "./LinkButton"
import range from "lodash/range"

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: "#fff",
    marginTop: 40,
  },
  footerContent: {
    alignItems: "center",
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  footerBorder: {
    borderTop: "1px solid #ccc",
    marginLeft: 20,
    marginRight: 20,
  },
  footerCount: {
    display: "inline-flex",
  },
  allSamplesButton: {
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.5)",
    marginRight: 10,
    paddingLeft: 8,
  },
  sampleIcon: {
    marginRight: 8,
  },
  menuButton: {
    marginRight: 8,
    color: "#fff",
  },
  grow: {
    flexGrow: 1,
  },
  buttons: {
    "& > *": {
      margin: 4,
    },
  },
  description: {
    padding: 10,
    "& img": {
      maxWidth: "calc(100% - 16px)",
      marginLeft: 8,
      marginRight: 8,
      maxHeight: 600,
    },
  },
  sectionHeader: {
    fontWeight: 700,
    fontSize: 12,
    padding: 10,
    paddingTop: 16,
    textTransform: "uppercase",
    color: colors.grey[600],
  },
  content: {
    padding: 10,
    // minHeight: "calc(100vh - 200px)"
  },
}))

export const SampleContainer = ({
  hideDescription: defaultHideDescription = window.localStorage.getItem(
    "hideDescription"
  ) === '"true"',
  lastSampleExitText,
  onExit,
  requireCompleteToPressNext = false,
  samples,
  minContentHeight,
  currentSampleIndex,
  totalSamples,
  onChangeSample,
  taskOutput = [],
  description,
  children,
}) => {
  const c = useStyles()
  const [hideDescription, changeHideDescriptionState] = useState(
    defaultHideDescription
  )
  const changeHideDescription = (hide) => {
    window.localStorage.setItem(
      "hideDescription",
      `"${hide ? "true" : "false"}"`
    )
    changeHideDescriptionState(hide)
  }

  const [sampleDrawerOpen, changeSampleDrawerOpen] = useState(false)
  return (
    <>
      <Grid container>
        {!hideDescription && (
          <Grid item xs={12} sm={12} md={6}>
            <div className={c.sectionHeader}>
              Description
              <LinkButton
                onClick={() => changeHideDescription(true)}
                text="hide"
              />
            </div>
            <div className={c.description}>
              <ReactMarkdown escapeHtml={false} source={description} />
            </div>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={hideDescription ? 12 : 6}>
          <div className={c.sectionHeader}>
            Sample {currentSampleIndex + 1}/{totalSamples}
            {hideDescription && (
              <LinkButton
                onClick={() => changeHideDescription(false)}
                text="show description"
              />
            )}
            {totalSamples > 1 && (
              <LinkButton
                onClick={() => changeSampleDrawerOpen(true)}
                text="view all"
              />
            )}
            {onExit && (
              <LinkButton onClick={() => onExit()} text="exit without saving" />
            )}
          </div>
          <div style={{ minHeight: minContentHeight }} className={c.content}>
            {children}
          </div>
        </Grid>
        {totalSamples > 1 && (
          <Grid item xs={12}>
            <div className={c.footer}>
              <div className={c.footerBorder} />
              <div className={c.footerContent}>
                <Button
                  onClick={() =>
                    onChangeSample(
                      (currentSampleIndex - 1 + totalSamples) % totalSamples
                    )
                  }
                >
                  <LeftIcon /> Prev Sample
                </Button>
                <Button
                  onClick={() => changeSampleDrawerOpen(true)}
                  className={c.footerCount}
                >
                  {currentSampleIndex + 1} / {totalSamples}
                </Button>
                <Button
                  disabled={
                    requireCompleteToPressNext &&
                    !taskOutput[currentSampleIndex]
                  }
                  onClick={() =>
                    onChangeSample((currentSampleIndex + 1) % totalSamples)
                  }
                >
                  {requireCompleteToPressNext && !taskOutput[currentSampleIndex]
                    ? "Save to Continue"
                    : "Next Sample"}
                  <RightIcon />
                </Button>
              </div>
            </div>
          </Grid>
        )}
      </Grid>
      <Drawer
        open={sampleDrawerOpen}
        anchor="left"
        onClose={() => changeSampleDrawerOpen(false)}
      >
        <List style={{ minWidth: 300 }}>
          <ListSubheader>Samples</ListSubheader>
          {range(0, totalSamples).map((i) => (
            <ListItem
              style={{
                backgroundColor:
                  i === currentSampleIndex ? colors.grey[200] : undefined,
              }}
              button
              onClick={() => onChangeSample(i)}
            >
              <ListItemIcon
                style={{
                  color:
                    i === currentSampleIndex ? colors.blue[500] : undefined,
                }}
              >
                {taskOutput[i] ? <CheckCircle /> : <CircleIcon />}
              </ListItemIcon>
              <ListItemText>Sample {i + 1}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default SampleContainer
