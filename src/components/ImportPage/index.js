// @flow weak

import React, { useState } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import * as colors from "@material-ui/core/colors"

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  "& .icon": {
    width: 48,
    height: 48,
    color: colors.grey[600]
  }
})

const Button = ({ Icon, children }) => {
  return (
    <ButtonBase variant="outlined">
      <div>
        <Icon className="icon" />
        <div>{children}</div>
      </div>
    </ButtonBase>
  )
}

export default () => {
  return (
    <div>
      <Button Icon={AssignmentReturnedIcon} variant="outlined">
        Paste Image URLs
      </Button>
    </div>
  )
}
