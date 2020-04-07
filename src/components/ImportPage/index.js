// @flow weak

import React, { useState, useContext, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned"
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import TextFieldsIcon from "@material-ui/icons/TextFields"
import DescriptionIcon from "@material-ui/icons/Description"
import PetsIcon from "@material-ui/icons/Pets"
import * as colors from "@material-ui/core/colors"
import PasteUrlsDialog from "../PasteUrlsDialog"
import ImportTextSnippetsDialog from "../ImportTextSnippetsDialog"
import useIsDesktop from "../../utils/use-is-desktop"
import useElectron from "../../utils/use-electron"
import classnames from "classnames"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import ImportFromGoogleDriveDialog from "../ImportFromGoogleDriveDialog"
import ImportUDTFileDialog from "../ImportUDTFileDialog"
import ImportToyDataset from "../ImportToyDatasetDialog"
import ImportFromYoutubeUrls from "../ImportFromYoutubeUrls"
import { FaGoogleDrive, FaYoutube } from "react-icons/fa"

const extendWithNull = (ar, len) => {
  ar = [...ar]
  while (ar.length < len) {
    ar.push(null)
  }
  return ar
}

const ButtonBase = styled(MuiButton)({
  width: 240,
  height: 140,
  display: "inline-flex",
  flexDirection: "column",
  "&.disabled": {
    backgroundColor: colors.grey[200],
  },
  margin: 8,
  "& .icon": {
    width: 48,
    height: 48,
    color: colors.grey[600],
    "&.disabled": {
      color: colors.grey[400],
    },
  },
})

const DesktopOnlyText = styled("div")({
  fontSize: 11,
  fontWeight: "bold",
  color: colors.grey[600],
  "&.disabled": {
    color: colors.grey[500],
  },
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

const convertToTaskDataObject = (fp) => {
  const ext = fp.split(".").slice(-1)[0].toLowerCase()
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
  const onChangeDialog = async (dialog) => {
    switch (dialog) {
      case "upload-directory": {
        if (!electron) return
        const {
          canceled,
          filePaths: dirPaths,
        } = await electron.remote.dialog.showOpenDialog({
          title: "Select Directory to Import Files",
          properties: ["openDirectory"],
        })
        if (canceled) return
        const dirPath = dirPaths[0]
        const fs = electron.remote.require("fs")
        const path = electron.remote.require("path")
        const importedFilePaths = (await fs.promises.readdir(dirPath))
          .filter((fn) => fn.includes("."))
          .map((fileName) => path.join(dirPath, fileName))

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
      default: {
        return changeDialog(dialog)
      }
    }
  }
  const closeDialog = () => changeDialog(null)
  const onAddSamples = useEventCallback(
    (appendedTaskData, appendedTaskOutput) => {
      let newOHA = setIn(
        oha,
        ["taskData"],
        (oha.taskData || []).concat(appendedTaskData)
      )
      if (appendedTaskOutput) {
        newOHA = setIn(
          newOHA,
          ["taskOutput"],
          extendWithNull(oha.taskOutput || [], oha.taskData.length).concat(
            appendedTaskOutput
          )
        )
      }
      onChangeOHA(newOHA, true)
      closeDialog()
    }
  )
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
        <Button
          isDesktop={isDesktop}
          dialog="import-toy-dataset"
          Icon={PetsIcon}
        >
          Import Toy Dataset
        </Button>
        <Button
          isDesktop={isDesktop}
          dialog="google-drive-file-picker"
          Icon={FaGoogleDrive}
        >
          Import from Google Drive
        </Button>
        <Button
          isDesktop={isDesktop}
          dialog="youtube-urls"
          Icon={FaYoutube}
          desktopOnly
        >
          Import from Youtube URLs
        </Button>
        <Button
          isDesktop={isDesktop}
          dialog="import-csv-json"
          Icon={DescriptionIcon}
        >
          Import from CSV / JSON
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
        <ImportFromGoogleDriveDialog
          open={selectedDialog === "google-drive-file-picker"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
        <ImportToyDataset
          open={selectedDialog === "import-toy-dataset"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
        <ImportFromYoutubeUrls
          open={selectedDialog === "youtube-urls"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
        <ImportUDTFileDialog
          open={selectedDialog === "import-csv-json"}
          onClose={closeDialog}
          onAddSamples={onAddSamples}
        />
      </div>
    </SelectDialogContext.Provider>
  )
}
