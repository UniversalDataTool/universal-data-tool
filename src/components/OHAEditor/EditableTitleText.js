// @flow
import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  textField: {
    marginLeft: 8
  }
})

const SAVE_WAIT = 2000

export default ({ value, onChange }) => {
  const c = useStyles()
  const [{ editing, newValue }, changeEditing] = useState({
    editing: false,
    newValue: value || ""
  })

  useEffect(() => {
    let listener = e => {
      if (e.key === "Enter") {
        onChange(newValue)
        changeEditing({ editing: false })
      }
    }
    window.addEventListener("keydown", listener)
    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [editing, newValue])

  useEffect(() => {
    if (editing) {
      let timeout = setTimeout(
        () => {
          onChange(newValue)
          changeEditing({ editing: false })
        },
        value === newValue ? SAVE_WAIT * 5 : SAVE_WAIT
      )

      return () => {
        if (timeout) clearTimeout(timeout)
      }
    } else {
      return () => {}
    }
  }, [editing, newValue])

  return (
    <TextField
      className={c.textField}
      label="File Name"
      variant="outlined"
      size="small"
      InputProps={{
        inputProps: { style: { color: "#000" } },
        disableUnderline: true
      }}
      onChange={e => {
        changeEditing({
          editing: true,
          newValue: e.target.value
        })
      }}
      value={newValue}
    />
  )
}
