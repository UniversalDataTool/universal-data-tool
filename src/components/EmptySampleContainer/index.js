// @flow

import React from "react"
import Typography from "@material-ui/core/Typography"
import SampleContainer from "../SampleContainer"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  root: {
    padding: 50,
    textAlign: "center"
  },
  title: {
    margin: 100
  },
  explain: {}
})

export default () => {
  const c = useStyles()
  return (
    <div className={c.root}>
      <Typography variant="h3" component="div" className={c.title}>
        No Samples to Show
      </Typography>
      <Typography variant="h5" component="div" className={c.explain}>
        Make sure that <code>taskData</code> is defined and not empty.
        <br />
        <br />
        Need help setting up? <a href="#">Check out this tutorial.</a>
      </Typography>
    </div>
  )
}
