import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"

const useStyles = makeStyles({
  table: {},
})

const hotkeyIconStyle = { marginLeft: 8, width: 16, height: 16 }

export default ({
  open,
  onClose,
  onChangeHotkey,
  hotkeyList,
  onClearHotkeys,
}) => {
  const classes = useStyles()
  const [selectedHotKey, setSelectedHotKey] = useState()
  const [{ modifier, key }, setCurrentKeyCombo] = useState({})

  useEffect(() => {
    if (!selectedHotKey) return
    function keyListener(e) {
      if (["shift", "ctrl", "cmd", "alt"].includes(e.key.toLowerCase())) {
        setCurrentKeyCombo({ modifier: e.key.toLowerCase(), key })
      }
      if (e.key.length === 1) {
        setCurrentKeyCombo({ modifier, key: e.key.toLowerCase() })
      }
    }
    window.addEventListener("keydown", keyListener)
    return () => {
      window.removeEventListener("keydown", keyListener)
    }
  }, [selectedHotKey, key, modifier, setCurrentKeyCombo])

  useEffect(() => {
    if (!key) return
    if (modifier) {
      onChangeHotkey(selectedHotKey, `${modifier} + ${key}`)
    } else {
      onChangeHotkey(selectedHotKey, key)
    }
    setCurrentKeyCombo({})
    setSelectedHotKey(null)
  }, [modifier, key, onChangeHotkey, selectedHotKey])

  return (
    <SimpleDialog
      title="Manage Keyboard Shortcuts"
      actions={[
        {
          text: "Clear Hotkeys",
          onClick: onClearHotkeys,
        },
      ]}
      open={open}
      onClose={onClose}
    >
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell align="right">Keyboard Shortcut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotkeyList.map((hotkey) => (
              <TableRow key={hotkey.description}>
                <TableCell>{hotkey.description}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => {
                      if (selectedHotKey !== hotkey) {
                        setSelectedHotKey(hotkey)
                        setCurrentKeyCombo({})
                        return
                      }
                    }}
                    style={{ minWidth: 0 }}
                  >
                    <b>
                      {selectedHotKey === hotkey
                        ? modifier || key
                          ? `<${modifier ? modifier + "+" : ""}${key || "???"}>`
                          : "<Press Any Key>"
                        : hotkey.binding}
                    </b>
                    {selectedHotKey === hotkey ? (
                      <EditIcon style={hotkeyIconStyle} />
                    ) : (
                      <EditIcon style={hotkeyIconStyle} />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SimpleDialog>
  )
}
