// @flow

import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import CloseIcon from "@material-ui/icons/Close"
import FullScreenIcon from "@material-ui/icons/Fullscreen"
import FullScreenExitIcon from "@material-ui/icons/FullscreenExit"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import { grey, blue, red } from "@material-ui/core/colors"
import ReactMarkdown from "react-markdown"
import { styled } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: grey[100],
  borderBottom: `1px solid ${grey[300]}`,
  paddingBottom: 12,
  boxShadow: "0px 2px 3px rgba(0,0,0,0.05)",
})
const StyledDialogContent = styled(DialogContent)({
  paddingTop: 16,
})
const StyledDialogActions = styled(DialogActions)({
  backgroundColor: grey[100],
  borderTop: `1px solid ${grey[300]}`,
})

export default ({
  open = false,
  title,
  children,
  markdownContent,
  onClose,
  red: redOn,
  noActionBar = false,
  actions = [],
}) => {
  const [fullScreen, changeFullScreen] = useState(false)
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <StyledDialogTitle>
        <Box display="flex" alignItems="center">
          <span style={{ color: redOn ? red[700] : undefined }}>{title}</span>
          <div style={{ flexGrow: 1 }} />
          <IconButton onClick={() => changeFullScreen(!fullScreen)}>
            {fullScreen ? <FullScreenExitIcon /> : <FullScreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Box maxWidth="90vw" minWidth={400} lineHeight={1.5}>
          {markdownContent ? (
            <ReactMarkdown source={markdownContent} />
          ) : (
            children
          )}
        </Box>
      </StyledDialogContent>
      {!noActionBar && (
        <StyledDialogActions>
          <Button onClick={() => onClose()}>
            <span style={{ color: grey[700], fontWeight: 500 }}>
              {t("close")}
            </span>
          </Button>
          {actions.map((action, i) => (
            <Button disabled={action.disabled} key={i} onClick={action.onClick}>
              <span
                style={{
                  color: redOn
                    ? red[700]
                    : action.disabled
                    ? grey[400]
                    : blue[700],
                  fontWeight: 500,
                }}
              >
                {action.text}
              </span>
            </Button>
          ))}
        </StyledDialogActions>
      )}
    </Dialog>
  )
}
