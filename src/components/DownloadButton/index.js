// @flow

import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import DownloadIcon from "@material-ui/icons/GetApp"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import HeaderPopupBox from "../HeaderPopupBox"

import { useTranslation } from "react-i18next"

const Container = styled("div")({
  position: "relative",
  "& .icon": {
    color: colors.grey[300],
  },
})

const StyledButton = styled(Button)({
  justifyContent: "flex-start",
  "& .fakeicon": {
    display: "inline-block",
    marginRight: 8,
    padding: 4,
    textAlign: "center",
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
    "&.orange": {
      backgroundColor: colors.orange[700],
    },
  },
})

export default ({ interfaceType, onDownload }) => {
  const [open, changeOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Container
      onMouseEnter={() => changeOpen(true)}
      onMouseLeave={() => changeOpen(false)}
    >
      <IconButton>
        <DownloadIcon className="icon" />
      </IconButton>
      <HeaderPopupBox open={open}>
        <h1>{t("download")}</h1>
        <StyledButton fullWidth onClick={() => onDownload("csv")}>
          <div className="fakeicon green">CSV</div>
          {t("download-csv")}
        </StyledButton>
        <StyledButton fullWidth onClick={() => onDownload("json")}>
          <div className="fakeicon blue">JSON</div>
          {t("download-json")}
        </StyledButton>
        <StyledButton
          fullWidth
          target="_blank"
          href="https://universaldatatool.com/convert"
        >
          <div className="fakeicon orange">↗</div>
          {t("other-formats")}
        </StyledButton>
      </HeaderPopupBox>
    </Container>
  )
}
