import React from "react"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { ThemeProvider } from "@material-ui/core/styles"
import "./theme.css"
import * as colors from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: {
    primary: colors.blue,
    secondary: colors.blue,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: {
      textTransform: "none",
    },
  },
})

export default ({ children }: any) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
