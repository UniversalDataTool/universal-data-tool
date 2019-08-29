import React from "react"
import { makeStyles } from "@material-ui/styles"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import "./theme.css"

const useStyles = makeStyles({
  container: {
    fontFamily: '"Inter", sans-serif'
  }
})

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none"
      }
    }
  }
})

export default ({ children }: any) => {
  const classes = useStyles()
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>{children}</div>
    </MuiThemeProvider>
  )
}
