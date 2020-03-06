// @flow
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer
} from "react"
import { makeStyles } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import Collapse from "@material-ui/core/Collapse"
import Fade from "@material-ui/core/Fade"
import classNames from "classnames"

const useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "flex-start",
    pointerEvents: "none"
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
      backgroundColor: colors.orange[700]
    },
    "&.error": {}
  }
})

const REFRESH_INTERVAL = 100

const ToastContext = createContext()

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
          id: Math.random()
            .toString()
            .split(".")[1],
          message: action.message,
          type: action.messageType,
          life: fullLife,
          fullLife
        }
      ])
    } else if (action.type === "tick") {
      return state
        .map(msg => ({
          ...msg,
          life: msg.life - REFRESH_INTERVAL
        }))
        .filter(msg => msg.life > 0)
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

  const addToast = (message: string, messageType: string = "info") =>
    changeToasts({ type: "add", message, messageType })

  return (
    <>
      <ToastContext.Provider value={{ toasts, addToast }}>
        {children}
      </ToastContext.Provider>
      <div className={c.root}>
        {toasts.map(msg => (
          <Collapse key={msg.id} in={msg.life < msg.fullLife}>
            <Fade in={msg.life > 600}>
              <div className={classNames(c.msgBox, msg.type)}>
                {msg.message}
              </div>
            </Fade>
          </Collapse>
        ))}
      </div>
    </>
  )
}
