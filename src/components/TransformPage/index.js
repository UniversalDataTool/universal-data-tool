// @flow weak

import React, { useState, useContext, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import ImageIcon from "@material-ui/icons/Image"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import PetsIcon from "@material-ui/icons/Pets"
import * as colors from "@material-ui/core/colors"
import PasteUrlsDialog from "../PasteUrlsDialog"
import ImportTextSnippetsDialog from "../ImportTextSnippetsDialog"
import useIsDesktop from "../../utils/use-is-desktop"
import useElectron from "../../utils/use-electron"
import classnames from "classnames"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo"
import TransformVideoKeyframesDialog from "../TransformVideoKeyframesDialog"

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  "&.disabled": {
    backgroundColor: colors.grey[200]
  },
  margin: 8,
  "& .icon": {
    width: 36,
    height: 36,
    color: colors.grey[600],
    "&.disabled": {
      color: colors.grey[400]
    }
  }
})

const DesktopOnlyText = styled("div")({
  fontSize: 11,
  fontWeight: "bold",
  color: colors.grey[600],
  "&.disabled": {
    color: colors.grey[500]
  }
})

const SelectDialogContext = createContext()

const Button = ({
  Icon1,
  Icon2,
  desktopOnly,
  isDesktop,
  children,
  dialog,
  disabled = false
}) => {
  disabled =
    disabled === undefined ? (desktopOnly ? !isDesktop : false) : disabled
  return (
    <SelectDialogContext.Consumer>
      {({ onChangeDialog }) => {
        return (
          <ButtonBase
            onClick={() => onChangeDialog(dialog)}
            className={classnames({ disabled })}
            variant="outlined"
            disabled={disabled}
          >
            <div>
              {Icon1 && Icon2 ? (
                <>
                  <Icon1 className={classnames("icon", { disabled })} />
                  <ArrowForwardIcon
                    className={classnames("icon", { disabled })}
                  />
                  <Icon2 className={classnames("icon", { disabled })} />
                </>
              ) : (
                <Icon1 className={classnames("icon", { disabled })} />
              )}
              <div>{children}</div>
              {desktopOnly && (
                <DesktopOnlyText className={classnames({ disabled })}>
                  DESKTOP ONLY
                </DesktopOnlyText>
              )}
            </div>
          </ButtonBase>
        )
      }}
    </SelectDialogContext.Consumer>
  )
}

export default ({ oha, onChangeOHA, isDesktop }) => {
  const [selectedDialog, changeDialog] = useState()
  const electron = useElectron()
  const onChangeDialog = async dialog => {
    switch (dialog) {
      case "convert-keyframes-to-samples": {
      }
      default: {
        return changeDialog(dialog)
      }
    }
  }
  const closeDialog = () => changeDialog(null)
  return (
    <SelectDialogContext.Provider value={{ onChangeDialog }}>
      <div>
        <Button
          isDesktop={isDesktop}
          disabled={oha.interface.type !== "video_segmentation"}
          dialog="convert-keyframes-to-samples"
          Icon1={OndemandVideoIcon}
          Icon2={ImageIcon}
        >
          Convert Video Keyframes to Samples
        </Button>
        <TransformVideoKeyframesDialog
          open={selectedDialog === "convert-keyframes-to-samples"}
          onClose={closeDialog}
          oha={oha}
          onChangeOHA={(...args) => {
            onChangeOHA(...args)
            closeDialog()
          }}
        />
      </div>
    </SelectDialogContext.Provider>
  )
}
