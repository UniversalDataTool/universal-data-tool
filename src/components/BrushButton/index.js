// @flow

import React, { useState, useMemo, useRef, useEffect } from "react"
import { useLocalStorage } from "react-use"
import { createPortal } from "react-dom"
import IconButton from "@material-ui/core/IconButton"
import BrushIcon from "@material-ui/icons/Brush"
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
import useEventCallback from "use-event-callback"
import memoize from "lodash/memoize"
import getBrushColorPalette from "../../utils/get-brush-color-palette.js"

const Container = styled("div")({ position: "relative" })
const BrushCircle = styled("div")(({ color }) => ({
  display: "inline",
  marginRight: 8,
  backgroundColor: color[700],
  width: 24,
  height: 24,
  borderRadius: 20,
}))

const OtherColorContainers = styled("div")({
  paddingTop: 10,
  padding: 4,
  display: "flex",
  flexWrap: "wrap",
})

const StyledIconButton = styled(IconButton)(({ iconColor, selected }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: iconColor[700],
  border: selected ? `4px solid ${iconColor["A200"]}` : "4px solid #fff",
  boxSizing: "content-box",
  margin: 4,
  transition: "transform 200ms linear",
  "&:hover": {
    backgroundColor: iconColor[800],
    transform: "scale(1.2,1.2)",
  },
  "&:active": {
    transition: "transform 100ms linear",
    transform: "scale(1.4,1.4)",
  },
}))

const StyledButton = styled(Button)(({ selected, iconColor }) => ({
  justifyContent: "flex-start",
  marginTop: 4,
  marginBottom: 4,
  paddingTop: 8,
  paddingBottom: 8,
  backgroundColor: selected ? iconColor[50] : "#fff",
  border: selected ? `2px solid ${iconColor[200]}` : "2px solid #fff",
  "&:hover": {
    backgroundColor: selected ? iconColor[100] : "none",
  },
}))

export default ({ selectedBrush, onChangeSelectedBrush }) => {
  const [open, changeOpen] = useState(false)
  const handleClick = useEventCallback((color) =>
    memoize(() => onChangeSelectedBrush(color))
  )

  return (
    <Container
      onMouseEnter={() => changeOpen(true)}
      onMouseLeave={() => changeOpen(false)}
    >
      <IconButton>
        <BrushIcon
          style={{ color: getBrushColorPalette(selectedBrush)[800] }}
        />
      </IconButton>
      <HeaderPopupBox open={open}>
        <h1>Sample Brushes</h1>
        <StyledButton
          selected={selectedBrush === "complete" || selectedBrush === "blue"}
          iconColor={colors.blue}
          fullWidth
          onClick={handleClick("complete")}
        >
          <BrushCircle color={colors.blue} />
          Complete
        </StyledButton>
        <StyledButton
          selected={
            selectedBrush === "review" || selectedBrush === "deepOrange"
          }
          iconColor={colors.deepOrange}
          fullWidth
          onClick={handleClick("review")}
        >
          <BrushCircle color={colors.deepOrange} />
          Review
        </StyledButton>
        <OtherColorContainers>
          <StyledIconButton
            onClick={handleClick("green")}
            selected={selectedBrush === "green"}
            iconColor={colors.green}
          />
          <StyledIconButton
            onClick={handleClick("purple")}
            selected={selectedBrush === "purple"}
            iconColor={colors.purple}
          />
          <StyledIconButton
            onClick={handleClick("pink")}
            selected={selectedBrush === "pink"}
            iconColor={colors.pink}
          />
          <StyledIconButton
            onClick={handleClick("cyan")}
            selected={selectedBrush === "cyan"}
            iconColor={colors.cyan}
          />
          <StyledIconButton
            onClick={handleClick("orange")}
            selected={selectedBrush === "orange"}
            iconColor={colors.orange}
          />
          <StyledIconButton
            onClick={handleClick("indigo")}
            selected={selectedBrush === "indigo"}
            iconColor={colors.indigo}
          />
        </OtherColorContainers>
      </HeaderPopupBox>
    </Container>
  )
}
