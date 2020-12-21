// @flow

import React, { useState, useEffect } from "react"
import { useLocalStorage } from "react-use"
import IconButton from "@material-ui/core/IconButton"
import PeopleIcon from "@material-ui/icons/People"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import AddBoxTwoTone from "@material-ui/icons/AddBoxTwoTone"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import CircularProgress from "@material-ui/core/CircularProgress"
import usePosthog from "../../hooks/use-posthog"
import HeaderPopupBox from "../HeaderPopupBox"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"

import { useTranslation } from "react-i18next"

const Container = styled("div")({ position: "relative" })
const ErrorText = styled("div")({
  color: colors.red[500],
  padding: 8,
  fontSize: 14,
})

const CreateNewButton = styled(Button)({
  marginTop: 16,
  justifyContent: "flex-start",
  color: colors.blue[500],
  "& .icon": {
    marginRight: 8,
    opacity: 0.7,
  },
})
const ExitButton = styled(Button)({
  marginTop: 16,
  justifyContent: "flex-start",
  "& .icon": {
    marginRight: 8,
    opacity: 0.7,
    color: colors.red[500],
  },
})

export default ({
  fileOpen = false,
  inSession = false,
  error,
  onJoinSession,
  onCreateSession,
  onLeaveSession,
  sessionBoxOpen,
  changeSessionBoxOpen,
  className,
}) => {
  const [loadingSession, changeLoadingSession] = useState(false)
  const [sessionUrl, changeSessionUrl] = useState("")
  const [userName, changeUserName] = useLocalStorage("userName", "anonymous")
  const posthog = usePosthog()

  // internalization hook
  const { t } = useTranslation()

  const [dm] = useActiveDatasetManager()

  let shareUrl
  if (dm?.type === "collaborative-session") {
    shareUrl = `${window.location.origin}?s=${dm.sessionId}`
  }

  useEffect(() => {
    if (loadingSession) {
      setTimeout(() => {
        changeLoadingSession(false)
      }, 10000)
    }
  }, [loadingSession])

  return (
    <Container
      title="collaborate-icon"
      onMouseEnter={() => changeSessionBoxOpen(true)}
      onMouseLeave={() => changeSessionBoxOpen(false)}
    >
      <IconButton
        style={{ color: inSession ? colors.blue[500] : colors.grey[300] }}
      >
        <PeopleIcon />
      </IconButton>
      <HeaderPopupBox open={sessionBoxOpen}>
        <h1>{t("collaborate")}</h1>
        {!inSession ? (
          <>
            <h2>{t("join-a-session")}</h2>
            <TextField
              variant="outlined"
              label="URL to Session"
              value={sessionUrl}
              onChange={(e) => changeSessionUrl(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        posthog.capture("join_collaborative_session")
                        onJoinSession(sessionUrl)
                      }}
                      disabled={!sessionUrl}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <CreateNewButton
              fullWidth
              disabled={!fileOpen || loadingSession || error}
              onClick={() => {
                posthog.capture("create_collaborative_session")
                onCreateSession()
                changeLoadingSession(true)
              }}
            >
              {loadingSession ? (
                <CircularProgress className="icon" size={24} />
              ) : (
                <AddBoxTwoTone className="icon" />
              )}
              Create New Session
            </CreateNewButton>
          </>
        ) : (
          <>
            <TextField
              style={{ marginTop: 12 }}
              readOnly
              variant="outlined"
              label="Share Link"
              value={shareUrl}
            />
            <TextField
              style={{ marginTop: 12 }}
              variant="outlined"
              label="User Name"
              value={userName}
              onChange={(e) => changeUserName(e.target.value)}
            />
            <ExitButton fullWidth onClick={onLeaveSession}>
              <ExitToAppIcon className="icon" />
              {t("leave-session")}
            </ExitButton>
          </>
        )}
      </HeaderPopupBox>
    </Container>
  )
}
