// @flow
import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  textField: {
    color: "#fff"
  }
})

const SAVE_WAIT = 2000

export default ({ value, onChange }) => {
  const c = useStyles()
  const [{ editing, newValue }, changeEditing] = useState({
    editing: false
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

  return editing ? (
    <TextField
      autoFocus
      className={c.textField}
      InputProps={{
        inputProps: { style: { color: "#fff" } }
      }}
      onChange={e => {
        changeEditing({
          editing: true,
          newValue: e.target.value
        })
      }}
      value={newValue}
    />
  ) : (
    <span
      onClick={() => {
        if (onChange) {
          changeEditing({ editing: true, newValue: value })
        }
      }}
    >
      {value}
    </span>
  )
}
