// @flow
import React, { createContext, useContext, useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { green } from "@material-ui/core/colors"
import Collapse from "@material-ui/core/Collapse"
import Fade from "@material-ui/core/Fade"

const useStyles = makeStyles({
  root: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none"
  },
  msgBox: {
    display: "flex",
    backgroundColor: green[700],
    color: "#fff",
    padding: 4,
    marginBottom: 4
  }
})

const REFRESH_INTERVAL = 100

const ToastContext = createContext()

export const useToasts = () => {
  const { addToast } = useContext(ToastContext)

  return { addToast }
}

export const ToastProvider = ({ children }) => {
  const [toasts, changeToasts] = useState([])

  useEffect(() => {
    if (toasts.length === 0) return () => {}
    let interval = setInterval(() => {
      changeToasts(
        toasts
          .map(msg => ({
            ...msg,
            life: msg.life - REFRESH_INTERVAL
          }))
          .filter(msg => msg.life > 0)
      )
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [toasts])

  function addToast(message: string) {
    changeToasts(
      toasts.concat([
        {
          id: Math.random()
            .toString()
            .split(".")[1],
          message,
          life: 2000
        }
      ])
    )
  }
  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export default () => {
  const c = useStyles()
  const { toasts } = useContext(ToastContext)
  return (
    <div className={c.root}>
      {toasts.map(msg => (
        <Collapse key={msg.id} in={msg.life < 5000}>
          <Fade in={msg.life > 500}>
            <div className={c.msgBox}>{msg.message}</div>
          </Fade>
        </Collapse>
      ))}
    </div>
  )
}
