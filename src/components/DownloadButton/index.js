// @flow

import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import DownloadIcon from "@material-ui/icons/GetApp"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import HeaderPopupBox from "../HeaderPopupBox"
import SimpleDialog from "../SimpleDialog"

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
    "&.orange": {
      backgroundColor: colors.orange[700],
    },
  },
})

export default ({ interfaceType, onDownload }) => {
  const [open, changeOpen] = useState(false)
  const [downloadMaskDialogOpen, setDownloadMaskDialogOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Container
      onMouseEnter={() => changeOpen(true)}
      onMouseLeave={() => changeOpen(false)}
    >
      <IconButton>
        <DownloadIcon />
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
        {(interfaceType || "").includes("image") &&
          (interfaceType || "").includes("segmentation") && (
            <StyledButton
              fullWidth
              onClick={() => setDownloadMaskDialogOpen(true)}
            >
              <div className="fakeicon orange">IMG</div>
              Download Masks
            </StyledButton>
          )}
      </HeaderPopupBox>
      <SimpleDialog
        title="How to Download Masks"
        open={downloadMaskDialogOpen}
        onClose={() => setDownloadMaskDialogOpen(false)}
      >
        We can't process the image masks online because of processing
        limitations, however, if you have "npm" installed you can run the line
        below to get all the masks in your file.
        <pre>npx autoseg some_file.udt.json -o output_directory</pre>
      </SimpleDialog>
    </Container>
  )
}
