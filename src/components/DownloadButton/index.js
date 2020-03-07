// @flow

import React, { useState, useMemo, useRef, useEffect } from "react"
import { useLocalStorage } from "react-use"
import { createPortal } from "react-dom"
import IconButton from "@material-ui/core/IconButton"
import DownloadIcon from "@material-ui/icons/GetApp"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import AddBoxTwoTone from "@material-ui/icons/AddBoxTwoTone"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import CircularProgress from "@material-ui/core/CircularProgress"
import HeaderPopupBox from "../HeaderPopupBox"

const Container = styled("div")({ position: "relative" })

export default ({}) => {
  const [open, changeOpen] = useState(false)

  return (
    <Container>
      <IconButton>
        <DownloadIcon />
      </IconButton>
      <HeaderPopupBox open>
        <h1>Download</h1>
      </HeaderPopupBox>
    </Container>
  )
}
