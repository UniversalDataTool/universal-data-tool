import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { ThemeProvider } from "@material-ui/core/styles"
import "./theme.css"
import * as colors from "@material-ui/core/colors"

const useStyles = makeStyles({
  container: {
    fontFamily: '"Inter", sans-serif'
  }
})

const theme = createMuiTheme({
  palette: {
    primary: colors.blue,
    secondary: colors.blue
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: {
      textTransform: "none"
    }
  }
})

export default ({ children }: any) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>{children}</div>
    </ThemeProvider>
  )
}
