// @flow
import React, { useState, useEffect, useRef } from "react"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  textField: {
    marginLeft: 8,
  },
})

const SAVE_WAIT = 2000

export default ({ value, onChange }) => {
  const c = useStyles()
  const [{ editing, newValue }, changeEditing] = useState({
    editing: false,
    newValue: value || "",
  })

  useEffect(() => {
    changeEditing({ editing, newValue: value })
  }, [value, editing])

  useEffect(() => {
    if (!editing) return
    let listener = (e) => {
      if (e.key === "Enter") {
        onChange(newValue)
        changeEditing({ editing: false })
      }
    }
    window.addEventListener("keydown", listener)
    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [editing, newValue, onChange])

  useEffect(() => {
    if (!newValue) return
    if (editing) {
      let timeout = setTimeout(
        () => {
          onChange(newValue)
          changeEditing({ editing: false })
        },
        value === newValue ? SAVE_WAIT * 5 : SAVE_WAIT
      )

      return () => clearTimeout(timeout)
    } else {
      return () => {}
    }
  }, [editing, newValue, value, onChange])

  return (
    <TextField
      className={c.textField}
      label="File Name"
      variant="outlined"
      size="small"
      InputProps={{
        inputProps: { style: { color: "#000" } },
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          e.stopPropagation()
          e.target.blur()
        }
      }}
      onKeyPress={(e) => {
        e.stopPropagation()
      }}
      onChange={(e) => {
        changeEditing({
          editing: true,
          newValue: e.target.value,
        })
      }}
      value={newValue || ""}
    />
  )
}
