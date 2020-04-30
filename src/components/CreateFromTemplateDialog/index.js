// @flow

import React from "react"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import templates from "../StartingPage/templates"
import SimpleDialog from "../SimpleDialog"

const useStyles = makeStyles({
  bigButton: {
    padding: 10,
    width: 150,
    height: 120,
    border: "1px solid #ccc",
    margin: 10,
  },
  bigIcon: {
    width: 48,
    height: 48,
  },
})

export default ({ open, onClose, onSelect }) => {
  const c = useStyles()
  return (
    <SimpleDialog title="Create from Template" open={open} onClose={onClose}>
      {templates.map((template) => (
        <Button
          key={template.name}
          onClick={() => onSelect(template)}
          className={c.bigButton}
        >
          <div>
            <div>{template.name}</div>
            <div>
              <template.Icon className={c.bigIcon} />
            </div>
          </div>
        </Button>
      ))}
    </SimpleDialog>
  )
}
