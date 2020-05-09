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
import usePosthog from "../../utils/use-posthog"

const Container = styled("div")({ position: "relative", marginLeft: 8 })
const WIDTH = 300
const borderColor = colors.grey[500]
const popupBoxBeforeAndAfter = {
  bottom: "100%",
  left: "25%",
  border: "solid transparent",
  content: '" "',
  height: 0,
  width: 0,
  position: "absolute",
  pointerEvents: "none",
}
const PopupBox = styled("div")({
  position: "absolute",
  zIndex: 10,
  top: 45,
  padding: 16,
  boxSizing: "border-box",
  borderRadius: 4,
  left: -WIDTH / 4 + 22,
  backgroundColor: "#fff",
  border: `1px solid ${borderColor}`,
  width: WIDTH,
  minHeight: 200,
  boxShadow: "0px 3px 12px rgba(0,0,0,0.3)",
  "&:before": {
    ...popupBoxBeforeAndAfter,
    borderColor: "rgba(0,0,0, 0)",
    borderBottomColor: borderColor,
    borderWidth: 12,
    marginLeft: -12,
  },
  "&:after": {
    ...popupBoxBeforeAndAfter,
    borderColor: "rgba(255,255,255, 0)",
    borderBottomColor: "#fff",
    borderWidth: 10,
    marginLeft: -10,
  },
  "& h1": {
    fontSize: 18,
    marginTop: 0,
    color: colors.blue[800],
  },
  "& h2": {
    fontSize: 14,
    color: colors.grey[800],
  },
  opacity: 1,
  transition: "opacity 200ms linear, transform 200ms ease",
  "&.hidden": {
    opacity: 0,
    transform: "translate(0, 10px)",
    pointerEvents: "none",
  },
})
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
}) => {
  const [loadingSession, changeLoadingSession] = useState(false)
  const [sessionUrl, changeSessionUrl] = useState("")
  const [userName, changeUserName] = useLocalStorage("userName", "anonymous")
  const posthog = usePosthog()

  useEffect(() => {
    if (loadingSession) {
      setTimeout(() => {
        changeLoadingSession(false)
      }, 10000)
    }
  }, [loadingSession])

  return (
    <Container
      onMouseEnter={() => changeSessionBoxOpen(true)}
      onMouseLeave={() => changeSessionBoxOpen(false)}
    >
      <IconButton style={{ color: inSession ? colors.blue[500] : undefined }}>
        <PeopleIcon />
      </IconButton>
      <PopupBox className={sessionBoxOpen ? "" : "hidden"}>
        <h1>Collaborate</h1>
        {!inSession ? (
          <>
            <h2>Join a Session</h2>
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
              variant="outlined"
              label="User Name"
              value={userName}
              onChange={(e) => changeUserName(e.target.value)}
            />
            <ExitButton fullWidth onClick={onLeaveSession}>
              <ExitToAppIcon className="icon" />
              Leave Session
            </ExitButton>
          </>
        )}
      </PopupBox>
    </Container>
  )
}
