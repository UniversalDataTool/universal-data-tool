// @flow

import React from "react"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  root: {
    padding: 50,
    textAlign: "center",
  },
  title: {
    margin: 50,
  },
  explain: {},
})

export default ({ title, description, children }) => {
  const c = useStyles()
  return (
    <div className={c.root}>
      <Typography variant="h3" component="div" className={c.title}>
        {title}
      </Typography>
      <Typography variant="h5" component="div" className={c.explain}>
        {description || children}
      </Typography>
    </div>
  )
}
