// @flow
import React, { createContext, useContext, useEffect, useReducer } from "react"
import { makeStyles } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Collapse from "@material-ui/core/Collapse"
import Fade from "@material-ui/core/Fade"
import classNames from "classnames"
import {
  CheckCircle as SuccessIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@material-ui/icons"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    bottom: 16,
    right: 16,
    alignItems: "flex-start",
  },
  msgBox: {
    display: "flex",
    backgroundColor: colors.blue[700],
    fontSize: 12,
    color: "#fff",
    padding: 4,
    marginBottom: 4,
    boxShadow: "0px 3px 8px rgba(0,0,0,0.5)",
    "&.warning": {
      backgroundColor: colors.orange[700],
    },
    "&.error": {
      backgroundColor: colors.red[700],
    },
  },
  notificationPaper: {
    display: "flex",
    borderRadius: 10,
    padding: 12,
    boxShadow: `0 2.8px 2.2px rgba(0, 0, 0, 0.034),
                0 6.7px 5.3px rgba(0, 0, 0, 0.048);`,
    backgroundColor: "#FFF",
    margin: 6,
  },
  icon: {
    borderLeft: `3px solid ${colors.blue[700]}`,
    color: colors.blue[700],
    "&.warning": {
      borderLeft: `3px solid ${colors.orange[700]}`,
      color: colors.orange[700],
    },
    "&.error": {
      borderLeft: `3px solid ${colors.red[700]}`,
      color: colors.red[700],
    },
    "&.info": {
      borderLeft: `3px solid ${colors.blue[700]}`,
      color: colors.blue[700],
    },
    "&.success": {
      borderLeft: `3px solid ${colors.green[700]}`,
      color: colors.green[700],
    },
  },
})

const REFRESH_INTERVAL = 100

const ToastContext = createContext({})

export const useToasts = () => {
  const { addToast } = useContext(ToastContext)

  return { addToast }
}

export const ToastProvider = ({ children }) => {
  const [toasts, changeToasts] = useReducer((state = [], action) => {
    if (action.type === "add") {
      const fullLife =
        action.messageType === "info"
          ? 2000
          : action.messageType === "warning"
          ? 5000
          : 5000

      return state.concat([
        {
          id: Math.random().toString().split(".")[1],
          message: action.message,
          type: action.messageType,
          onClick: action.onClick || null,
          life: fullLife,
          fullLife,
        },
      ])
    } else if (action.type === "tick") {
      return state
        .map((msg) => ({
          ...msg,
          life: msg.life - REFRESH_INTERVAL,
        }))
        .filter((msg) => msg.life > 0)
    } else if (action.type === "remove") {
      return state
        .map((msg) => ({
          ...msg,
          life: msg.life - REFRESH_INTERVAL,
        }))
        .filter((msg) => msg.id !== action.id)
    }
    return state
  }, [])
  const c = useStyles()

  useEffect(() => {
    if (toasts.length === 0) return () => {}
    let interval = setInterval(() => {
      changeToasts({ type: "tick" })
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [toasts])

  const addToast = (
    message: string,
    messageType: string = "info",
    onClick: function
  ) => changeToasts({ type: "add", message, messageType, onClick })

  return (
    <>
      <ToastContext.Provider value={{ toasts, addToast }}>
        {children}
      </ToastContext.Provider>
      <div className={c.root}>
        {toasts.map((msg) => (
          <Collapse key={msg.id} in={msg.life < msg.fullLife}>
            <Fade in={msg.life > 600}>
              <Notification
                type={msg.type}
                message={msg.message}
                onClick={msg.onClick}
                onClose={() => changeToasts({ type: "remove", id: msg.id })}
              />
            </Fade>
          </Collapse>
        ))}
      </div>
    </>
  )
}

export const Notification = ({ type, message, onClick, onClose }) => {
  const classes = useStyles()
  let Icon = null
  switch (type) {
    case "success":
      Icon = SuccessIcon
      break
    case "warning":
      Icon = WarningIcon
      break
    case "error":
      Icon = ErrorIcon
      break
    default:
      Icon = InfoIcon
  }
  return (
    <paper
      className={classes.notificationPaper}
      style={{ position: "relative", cursor: "pointer" }}
      onClick={onClick}
    >
      <div className={classNames(classes.icon, type)}>
        <Icon fontSize="large" style={{ padding: 12 }} />
      </div>
      <div style={{ margin: "auto 0" }}>
        <Typography variant="body1">{message}</Typography>
      </div>
      <div
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          backgroundColor: "#FFF",
          borderRadius: 100,
        }}
      >
        <IconButton color="action" size="small">
          <CloseIcon onClick={onClose} />
        </IconButton>
      </div>
    </paper>
  )
}
