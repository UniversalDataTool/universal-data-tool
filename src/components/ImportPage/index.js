// @flow weak

import React, { useState, useContext, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import * as colors from "@material-ui/core/colors"
import PasteUrlsDialog from "../PasteUrlsDialog"

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  margin: 8,
  "& .icon": {
    width: 48,
    height: 48,
    color: colors.grey[600]
  }
})

const SelectDialogContext = createContext()

const Button = ({ isDesktop, ...props }) => (
  <StyledButton disabled={isDesktop} variant="outlined" {...props} />
)

const StyledButton = ({ Icon, children, dialog }) => {
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
        <Button
          dialog="upload-directory"
          Icon={CreateNewFolderIcon}
          variant="outlined"
        >
          Files from Directory
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
