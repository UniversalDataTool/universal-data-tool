// @flow weak

import React, { useState, useContext, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import * as colors from "@material-ui/core/colors"
import PasteUrlsDialog from "../PasteUrlsDialog"

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  "& .icon": {
    width: 48,
    height: 48,
    color: colors.grey[600]
  }
})

const SelectDialogContext = createContext()

const Button = ({ Icon, children, dialog }) => {
  return (
    <SelectDialogContext.Consumer>
      {({ changeDialog }) => (
        <ButtonBase onClick={() => changeDialog(dialog)} variant="outlined">
          <div>
            <Icon className="icon" />
            <div>{children}</div>
          </div>
        </ButtonBase>
      )}
    </SelectDialogContext.Consumer>
  )
}

export default ({ oha, onChangeOHA }) => {
  const [selectedDialog, changeDialog] = useState()
  const closeDialog = () => changeDialog(null)
  return (
    <SelectDialogContext.Provider value={{ changeDialog }}>
      <div>
        <Button
          dialog="paste-image-urls"
          Icon={AssignmentReturnedIcon}
          variant="outlined"
        >
          Paste URLs
        </Button>
        <PasteUrlsDialog
          open={selectedDialog === "paste-image-urls"}
          onClose={closeDialog}
          onAddSamples={samples => {
            onChangeOHA(
              {
                ...oha,
                taskData: (oha.taskData || []).concat(samples)
              },
              true
            )
            closeDialog()
          }}
        />
      </div>
    </SelectDialogContext.Provider>
  )
}
