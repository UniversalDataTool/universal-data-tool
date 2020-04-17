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
import ImportFromS3Dialog from "../ImportFromS3Dialog"
import ImportTextSnippetsDialog from "../ImportTextSnippetsDialog"
import useIsDesktop from "../../utils/use-is-desktop"
import useElectron from "../../utils/use-electron"
import classnames from "classnames"
import SvgIcon from "@material-ui/core/SvgIcon"
import isEmpty from "../../utils/isEmpty"
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

const Button = ({
  Icon,
  desktopOnly,
  isDesktop,
  children,
  dialog,
  authConfiguredOnly,
  authConfig,
  signedInOnly,
  user,
}) => {
  const disabled = desktopOnly
    ? !isDesktop
    : authConfiguredOnly
    ? signedInOnly
      ? isEmpty(user)
      : isEmpty(authConfig)
    : false
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
              {authConfiguredOnly && isEmpty(authConfig) && (
                <DesktopOnlyText className={classnames({ disabled })}>
                  AUTH MUST BE CONFIGURED
                </DesktopOnlyText>
              )}
              {signedInOnly && isEmpty(user) && (
                <DesktopOnlyText className={classnames({ disabled })}>
                  MUST BE SIGNED IN
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

const S3Icon = (props, disabled) => {
  const iconStyle = { fill: "black" }
  return (
    <SvgIcon {...props} viewBox="0 0 50 50">
      <g id="Working">
        <path
          style={props.color}
          d="M21.17,42.88H13.76a1,1,0,0,1-1-1v-7.5a1,1,0,0,1,1-1h7.41a1,1,0,0,1,1,1v7.5A1,1,0,0,1,21.17,42.88Zm-6.41-2h5.41v-5.5H14.76Z"
        />
        <path
          style={props.color}
          d="M31,39.17a5.24,5.24,0,1,1,5.22-5.24A5.23,5.23,0,0,1,31,39.17Zm0-8.48a3.24,3.24,0,1,0,3.22,3.24A3.23,3.23,0,0,0,31,30.69Z"
        />
        <path
          style={props.color}
          d="M20.22,29.75H10.85a1,1,0,0,1-.87-.51,1,1,0,0,1,0-1l4.69-7.82a1,1,0,0,1,1.71,0l4.69,7.82a1,1,0,0,1,0,1A1,1,0,0,1,20.22,29.75Zm-7.61-2h5.85l-2.92-4.87Z"
        />
        <path
          style={props.color}
          d="M23.67,48.5c-6.39,0-16.5-1.45-16.63-5.34L2.51,9.55a1,1,0,0,1,2-.39c.5,1.93,8.05,4.63,19.2,4.63s18.69-2.7,19.19-4.63a1,1,0,0,1,2,.39L40.29,43.16c0,1.32-1.22,2.45-3.51,3.36a22.87,22.87,0,0,1-3.12.94A46,46,0,0,1,23.67,48.5ZM4.9,12.27,9,43s0,.09,0,.13c0,1.18,5.69,3.42,14.63,3.42a43.75,43.75,0,0,0,9.54-1A21,21,0,0,0,36,44.66c1.85-.73,2.26-1.39,2.26-1.58V43l4.14-30.68c-3.86,2.3-11.64,3.52-18.77,3.52S8.75,14.57,4.9,12.27Z"
        />
        <path
          style={props.color}
          d="M23.67,15.79c-9.47,0-20.1-2.15-21.14-6.12,0-.05,0-.09,0-.13l0-.41a.62.62,0,0,1,0-.13c0-4.42,11.18-7.5,21.22-7.5S44.88,4.58,44.88,9v.13l-.06.41a.69.69,0,0,1,0,.13C43.76,13.64,33.13,15.79,23.67,15.79ZM4.48,9.21c.62,1.93,8.14,4.58,19.19,4.58s18.56-2.65,19.18-4.58l0-.27C42.75,7,34.86,3.5,23.67,3.5S4.59,7,4.45,8.94Z"
        />
        <path
          style={props.color}
          d="M44.93,29.62c-4.76,0-15.18-4.71-21.7-7.91l.88-1.8c9,4.42,19.6,8.52,21.41,7.75-.14-.29-.81-1.19-4-2.92l-.16-.1,1-1.74.15.09c3.21,1.77,4.74,3.13,5,4.41a1.82,1.82,0,0,1-.4,1.52A2.77,2.77,0,0,1,44.93,29.62Z"
        />
        <path
          style={props.color}
          d="M23.67,23a2.17,2.17,0,1,1,2.17-2.17A2.18,2.18,0,0,1,23.67,23Zm0-2.34a.17.17,0,0,0-.18.17c0,.19.35.19.35,0A.17.17,0,0,0,23.67,20.64Z"
        />
      </g>
    </SvgIcon>
  )
}

export default ({ oha, onChangeOHA, isDesktop, authConfig, user }) => {
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
    (appendedTaskData, appendedTaskOutput, json) => {
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
      if(json.content){
        newOHA = setIn(
          newOHA,
          ["interface"],
          json.content.interface
        )
      }
      onChangeOHA(newOHA, true,json.fileName)
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
          authConfig={authConfig}
          signedInOnly={false}
          user={user}
        >
          Paste URLs
        </Button>
        <Button
          desktopOnly
          isDesktop={isDesktop}
          dialog="upload-directory"
          Icon={CreateNewFolderIcon}
          authConfig={authConfig}
          signedInOnly={false}
          user={user}
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
          dialog="youtube-urls"
          Icon={FaYoutube}
          desktopOnly
        >
          Import from Youtube URLs
        </Button>
        <Button
          isDesktop={isDesktop}
          dialog="import-from-s3"
          Icon={S3Icon}
          authConfiguredOnly={true}
          authConfig={authConfig}
          signedInOnly={true}
          user={user}
        >
          Import from S3
        </Button>
        <Button
          isDesktop={isDesktop}
          dialog="google-drive-file-picker"
          Icon={FaGoogleDrive}
          onAddSamples={onAddSamples}
        >
          Import from Google Drive
          </Button>
        <Button
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
        <ImportFromS3Dialog
          authConfig={authConfig}
          open={selectedDialog === "import-from-s3"}
          onClose={closeDialog}
          user={user}
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
