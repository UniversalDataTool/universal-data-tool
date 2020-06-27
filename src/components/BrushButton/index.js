// @flow

import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import BrushIcon from "@material-ui/icons/Brush"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import HeaderPopupBox from "../HeaderPopupBox"
import useEventCallback from "use-event-callback"
import memoize from "lodash/memoize"
import getBrushColorPalette from "../../utils/get-brush-color-palette.js"

import { useTranslation } from "react-i18next"

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

const StyledIconButton = styled(IconButton)(({ iconcolor, selected }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: iconcolor[700],
  border: selected ? `4px solid ${iconcolor["A200"]}` : "4px solid #fff",
  boxSizing: "content-box",
  margin: 4,
  transition: "transform 200ms linear",
  "&:hover": {
    backgroundColor: iconcolor[800],
    transform: "scale(1.2,1.2)",
  },
  "&:active": {
    transition: "transform 100ms linear",
    transform: "scale(1.4,1.4)",
  },
}))

const StyledButton = styled(Button)(({ selected, iconcolor }) => ({
  justifyContent: "flex-start",
  marginTop: 4,
  marginBottom: 4,
  paddingTop: 8,
  paddingBottom: 8,
  backgroundColor: selected ? iconcolor[50] : "#fff",
  border: selected ? `2px solid ${iconcolor[200]}` : "2px solid #fff",
  "&:hover": {
    backgroundColor: selected ? iconcolor[100] : "none",
  },
}))

export default ({ selectedBrush, onChangeSelectedBrush }) => {
  const [open, changeOpen] = useState(false)
  const handleClick = useEventCallback((color) =>
    memoize(() => onChangeSelectedBrush(color))
  )

  // internalization hook
  const { t } = useTranslation()

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
        <h1>{t("sample-brushes")}</h1>
        <StyledButton
          selected={selectedBrush === "complete" || selectedBrush === "blue"}
          iconcolor={colors.blue}
          fullWidth
          onClick={handleClick("complete")}
        >
          <BrushCircle color={colors.blue} />
          {t("complete")}
        </StyledButton>
        <StyledButton
          selected={
            selectedBrush === "review" || selectedBrush === "deepOrange"
          }
          iconcolor={colors.deepOrange}
          fullWidth
          onClick={handleClick("review")}
        >
          <BrushCircle color={colors.deepOrange} />
          {t("review")}
        </StyledButton>
        <OtherColorContainers>
          <StyledIconButton
            onClick={handleClick("green")}
            selected={selectedBrush === "green"}
            iconcolor={colors.green}
          />
          <StyledIconButton
            onClick={handleClick("purple")}
            selected={selectedBrush === "purple"}
            iconcolor={colors.purple}
          />
          <StyledIconButton
            onClick={handleClick("pink")}
            selected={selectedBrush === "pink"}
            iconcolor={colors.pink}
          />
          <StyledIconButton
            onClick={handleClick("cyan")}
            selected={selectedBrush === "cyan"}
            iconcolor={colors.cyan}
          />
          <StyledIconButton
            onClick={handleClick("orange")}
            selected={selectedBrush === "orange"}
            iconcolor={colors.orange}
          />
          <StyledIconButton
            onClick={handleClick("indigo")}
            selected={selectedBrush === "indigo"}
            iconcolor={colors.indigo}
          />
        </OtherColorContainers>
      </HeaderPopupBox>
    </Container>
  )
}
