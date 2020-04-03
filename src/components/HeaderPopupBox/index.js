// @flow

import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const WIDTH = 300
const borderColor = colors.grey[500]
const popupBoxBeforeAndAfter = {
  bottom: "100%",
  left: "25%",
  border: "solid transparent",
  content: '" "',
  height: 0,
  width: 0,
  position: "absolute",
  pointerEvents: "none",
}
const PopupBox = styled("div")({
  position: "absolute",
  top: 45,
  padding: 16,
  boxSizing: "border-box",
  borderRadius: 4,
  left: -WIDTH / 4 + 22,
  backgroundColor: "#fff",
  border: `1px solid ${borderColor}`,
  width: WIDTH,
  minHeight: 200,
  boxShadow: "0px 3px 12px rgba(0,0,0,0.3)",
  "&:before": {
    ...popupBoxBeforeAndAfter,
    borderColor: "rgba(0,0,0, 0)",
    borderBottomColor: borderColor,
    borderWidth: 12,
    marginLeft: -12,
  },
  "&:after": {
    ...popupBoxBeforeAndAfter,
    borderColor: "rgba(255,255,255, 0)",
    borderBottomColor: "#fff",
    borderWidth: 10,
    marginLeft: -10,
  },
  "& h1": {
    fontSize: 18,
    marginTop: 0,
    color: colors.blue[800],
  },
  "& h2": {
    fontSize: 14,
    color: colors.grey[800],
  },
  opacity: 1,
  transition: "opacity 200ms linear, transform 200ms ease",
  "&.hidden": {
    opacity: 0,
    transform: "translate(0, 10px)",
    pointerEvents: "none",
  },
})

export default ({ open, children }) => {
  return <PopupBox className={open ? "" : "hidden"}>{children}</PopupBox>
}
