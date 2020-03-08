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

const StyledButton = styled(Button)({
  justifyContent: "flex-start",
  "& .fakeicon": {
    display: "inline",
    marginRight: 8,
    padding: 4,
    paddingTop: 5,
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: colors.grey[700],
    borderRadius: 4,
    width: 36,
    "&.blue": {
      backgroundColor: colors.blue[700]
    },
    "&.green": {
      backgroundColor: colors.green[700]
    }
  }
})

export default ({ onDownload }) => {
  const [open, changeOpen] = useState(false)

  return (
    <Container
      onMouseEnter={() => changeOpen(true)}
      onMouseLeave={() => changeOpen(false)}
    >
      <IconButton>
        <DownloadIcon />
      </IconButton>
      <HeaderPopupBox open={open}>
        <h1>Download</h1>
        <StyledButton fullWidth onClick={() => onDownload("csv")}>
          <div className="fakeicon green">CSV</div>
          Download CSV
        </StyledButton>
        <StyledButton fullWidth onClick={() => onDownload("json")}>
          <div className="fakeicon blue">JSON</div>
          Download JSON
        </StyledButton>
      </HeaderPopupBox>
    </Container>
  )
}
