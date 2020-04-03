// @flow
import React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  linkButtonContainer: {
    marginLeft: 8,
    marginRight: 8,
  },
  linkButton: {
    textTransform: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
})

export default ({ onClick, text }: { onClick: Function, text: string }) => {
  const c = useStyles()
  return (
    <span className={c.linkButtonContainer}>
      (
      <span onClick={onClick} className={c.linkButton}>
        {text}
      </span>
      )
    </span>
  )
}
