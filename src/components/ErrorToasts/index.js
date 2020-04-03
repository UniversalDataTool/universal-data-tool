// @flow
import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { red } from "@material-ui/core/colors"
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
    pointerEvents: "none",
  },
  errorBox: {
    display: "flex",
    backgroundColor: red[700],
    color: "#fff",
    padding: 4,
    marginBottom: 4,
  },
})

export default ({ errors }) => {
  const c = useStyles()
  return (
    <div className={c.root}>
      {errors.map((err) => (
        <Collapse key={err.id} in={err.life < 5000}>
          <Fade in={err.life > 500}>
            <div className={c.errorBox}>{err.message}</div>
          </Fade>
        </Collapse>
      ))}
    </div>
  )
}
