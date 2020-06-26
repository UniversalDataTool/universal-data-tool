// @flow

import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import DownloadIcon from "@material-ui/icons/GetApp"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import HeaderPopupBox from "../HeaderPopupBox"

import { useTranslation } from "react-i18next"

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
      backgroundColor: colors.blue[700],
    },
    "&.green": {
      backgroundColor: colors.green[700],
    },
  },
})

export default ({ onDownload }) => {
  const [open, changeOpen] = useState(false)
  const { t, i18n } = useTranslation()

  return (
    <Container
      onMouseEnter={() => changeOpen(true)}
      onMouseLeave={() => changeOpen(false)}
    >
      <IconButton>
        <DownloadIcon />
      </IconButton>
      <HeaderPopupBox open={open}>
        <h1>{t("Download")}</h1>
        <StyledButton fullWidth onClick={() => onDownload("csv")}>
          <div className="fakeicon green">CSV</div>
          {t("Download")} CSV
        </StyledButton>
        <StyledButton fullWidth onClick={() => onDownload("json")}>
          <div className="fakeicon blue">JSON</div>
          {t("Download")} JSON
        </StyledButton>
      </HeaderPopupBox>
    </Container>
  )
}
