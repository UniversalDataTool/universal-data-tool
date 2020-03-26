// @flow weak

import React, { useState, useContext, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import PetsIcon from "@material-ui/icons/Pets"
import * as colors from "@material-ui/core/colors"
import PasteUrlsDialog from "../PasteUrlsDialog"
import ImportTextSnippetsDialog from "../ImportTextSnippetsDialog"
import useIsDesktop from "../../utils/use-is-desktop"
import useElectron from "../../utils/use-electron"
import classnames from "classnames"
import catImages from "./cat-images.js"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"

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
    width: 48,
    height: 48,
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

const Button = ({ Icon, desktopOnly, isDesktop, children, dialog }) => {
  const disabled = desktopOnly ? !isDesktop : false
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
              <Icon className={classnames("icon", { disabled })} />
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

const convertToTaskDataObject = fp => {
  const ext = fp
    .split(".")
    .slice(-1)[0]
    .toLowerCase()
  if (["png", "jpg", "jpeg"].includes(ext)) {
    return { imageUrl: `file://${fp}` }
  }
  if (["pdf"].includes(ext)) {
    return { pdfUrl: `file://${fp}` }
  }
  if (["mp4", "webm", "mkv"].includes(ext)) {
    return { videoUrl: `file://${fp}` }
  }
  return null
}

export default ({ oha, onChangeOHA, isDesktop }) => {
  const [selectedDialog, changeDialog] = useState()
  const electron = useElectron()
  const onChangeDialog = async dialog => {
    switch (dialog) {
      case "upload-directory": {
        if (!electron) return
        const {
          canceled,
          filePaths: dirPaths
        } = await electron.remote.dialog.showOpenDialog({
          title: "Select Directory to Import Files",
          properties: ["openDirectory"]
        })
        if (canceled) return
        const dirPath = dirPaths[0]
        const fs = electron.remote.require("fs")
        const path = electron.remote.require("path")
        const importedFilePaths = (await fs.promises.readdir(dirPath))
          .filter(fn => fn.includes("."))
          .map(fileName => path.join(dirPath, fileName))

        onChangeOHA(
          setIn(
            oha,
            ["taskData"],
            (oha.taskData || []).concat(
              importedFilePaths.map(convertToTaskDataObject).filter(Boolean)
            )
          ),
          true
        )
        return
      }
      case "import-cats": {
        onChangeOHA(
          setIn(
            oha,
            ["taskData"],
            (oha.taskData || []).concat(
              catImages.map(imageUrl => ({ imageUrl }))
            )
          ),
          true
        )
        return
      }
      default: {
        return changeDialog(dialog)
      }
    }
  }
  const closeDialog = () => changeDialog(null)
  const onAddSamples = useEventCallback(samples => {
    onChangeOHA(
      setIn(oha, ["taskData"], (oha.taskData || []).concat(samples)),
      true
    )
    closeDialog()
  })
  return (
    <SelectDialogContext.Provider value={{ onChangeDialog }}>
      <div>
        <Button
          isDesktop={isDesktop}
          dialog="paste-image-urls"
          Icon={AssignmentReturnedIcon}
        >
          Paste URLs
        </Button>
        <Button
          desktopOnly
          isDesktop={isDesktop}
          dialog="upload-directory"
          Icon={CreateNewFolderIcon}
        >
          Files from Directory
        </Button>
        <Button dialog="import-text-snippets" Icon={TextFieldsIcon}>
          Import Text Snippets
        </Button>
        <Button isDesktop={isDesktop} dialog="import-cats" Icon={PetsIcon}>
          Import Cat Images
        </Button>
        <ImportTextSnippetsDialog
          open={selectedDialog === "import-text-snippets"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
        <PasteUrlsDialog
          open={selectedDialog === "paste-image-urls"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
      </div>
    </SelectDialogContext.Provider>
  )
}
