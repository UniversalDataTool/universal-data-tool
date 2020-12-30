import React from "react"
import { styled, colors, makeStyles } from "@material-ui/core"

export const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[900],
    height: "100vh",
  },
  languageSelectionWrapper: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  languageSelectionBox: {
    display: "flex",
    paddingTop: 24,
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}))

export const ContentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
  color: "#fff",
  overflowY: "scroll",
  padding: 100,
  [theme.breakpoints.down("sm")]: {
    padding: 50,
  },
}))
export const Content = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "calc(100% - 32px)",
  marginLeft: 16,
  maxWidth: 1000,
}))

export const Title = styled("div")({
  marginTop: 20,
  fontSize: 36,
  fontWeight: 600,
  color: colors.grey[300],
})

export const Subtitle = styled("div")({
  fontSize: 18,
  // fontWeight: "bold",
  marginTop: 8,
  color: colors.grey[500],
})
export const ActionList = styled("div")({ marginTop: 48 })
export const Action = styled("a")({
  display: "block",
  color: colors.blue[500],
  marginTop: 4,
  cursor: "pointer",
  textDecoration: "none",
})
export const ActionTitle = styled("div")({
  // fontWeight: "bold",
  fontSize: 24,
  marginBottom: 8,
  color: colors.grey[500],
})
export const ActionText = styled("div")({
  color: colors.grey[300],
  "& a": {
    cursor: "pointer",
    color: colors.blue[500],
    textDecoration: "none",
  },
})
export const Actionless = styled("div")({
  color: colors.grey[600],
  paddingTop: 16,
})
export const BottomSpacer = styled("div")({ height: 100 })
