// @flow
import React, { useState } from "react"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"
import isEmpty from "lodash/isEmpty"

const useStyles = makeStyles({
  textField: {
    marginLeft: 8,
  },
})

export default ({ value, onChange }) => {
  const c = useStyles()
  const [newValue, setNewValue] = useState(value || "")

  const onBlur = () => {
    if (!isEmpty(newValue) && newValue !== "unnamed") {
      onChange(newValue)
      setNewValue(newValue)
    } else {
      setNewValue(value)
    }
  }

  return (
    <TextField
      className={c.textField}
      label="File Name"
      variant="outlined"
      size="small"
      InputProps={{
        inputProps: { style: { color: "#000" } },
      }}
      onBlur={onBlur}
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
        setNewValue(e.target.value)
      }}
      value={newValue || ""}
    />
  )
}
