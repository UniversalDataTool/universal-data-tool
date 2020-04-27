// @flow weak

import React, { useState, createContext } from "react"
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
import useElectron from "../../utils/use-electron"
import classnames from "classnames"
import SvgIcon from "@material-ui/core/SvgIcon"
import S3Icon from "./S3Icon"
import isEmpty from "../../utils/isEmpty"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import ImportFromGoogleDriveDialog from "../ImportFromGoogleDriveDialog"
import ImportUDTFileDialog from "../ImportUDTFileDialog"
import ImportToyDataset from "../ImportToyDatasetDialog"
import ImportFromYoutubeUrls from "../ImportFromYoutubeUrls"
import { FaGoogleDrive, FaYoutube } from "react-icons/fa"
import usePosthog from "../../utils/use-posthog"

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
  const posthog = usePosthog()
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
            onClick={() => {
              posthog.capture("import_button_clicked", {
                import_button: dialog,
              })
              onChangeDialog(dialog)
            }}
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

export default ({
  file,
  oha,
  onChangeFile,
  onChangeOHA,
  isDesktop,
  authConfig,
  user,
}) => {
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
  function setAnnotations(taskOutput, appendedTaskOutput, configImport) {
    if (
      !isEmpty(configImport) &&
      typeof configImport.annotationToKeep !== "undefined"
    ) {
      if (configImport.annotationToKeep === "both") {
        if (appendedTaskOutput) {
          taskOutput = extendWithNull(
            oha.taskOutput || [],
            oha.taskData.length
          ).concat(appendedTaskOutput)
        }
      }
      if (configImport.annotationToKeep === "incoming") {
        if (appendedTaskOutput) {
          taskOutput = extendWithNull([], oha.taskData.length).concat(
            appendedTaskOutput
          )
        }
      }
      if (configImport.annotationToKeep === "current") {
        if (appendedTaskOutput) {
          taskOutput = extendWithNull(oha.taskOutput || [], oha.taskData.length)
        }
      }
    } else {
      if (appendedTaskOutput) {
        taskOutput = extendWithNull(
          oha.taskOutput || [],
          oha.taskData.length
        ).concat(appendedTaskOutput)
      }
    }
    return taskOutput
  }
  function getSampleNameFromURL(sample) {
    var sampleName
    if (typeof sample.imageUrl !== "undefined") {
      sampleName = sample.imageUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    } else {
      sampleName = sample.videoUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    return sampleName
  }
  function searchSampleName(sampleName, myArray) {
    var nameToSearch
    for (var i = 0; i < myArray.length; i++) {
      nameToSearch = getSampleNameFromURL(myArray[i])
      if (typeof myArray[i].sampleName !== "undefined") {
        nameToSearch[1] = myArray[i].sampleName
      }
      if (
        nameToSearch[0] !== sampleName[0] &&
        nameToSearch[1] === sampleName[1]
      ) {
        return true
      }
    }
    return false
  }

  function giveSampleName(appendedTaskData) {
    for (var i = 0; i < appendedTaskData.length; i++) {
      var sampleName = getSampleNameFromURL(appendedTaskData[i])
      var boolName = true
      var v = 1
      while (boolName) {
        if (
          searchSampleName(sampleName, oha.taskData) ||
          searchSampleName(sampleName, appendedTaskData)
        ) {
          sampleName[1] = sampleName[2] + v.toString() + "." + sampleName[3]
          v++
        } else {
          appendedTaskData[i].sampleName = sampleName[1]
          boolName = false
        }
      }
      appendedTaskData[i].sampleName = sampleName[1]
    }
    return appendedTaskData
  }

  const closeDialog = () => changeDialog(null)
  const onAddSamples = useEventCallback(
    async (appendedTaskData, appendedTaskOutput, json, configImport) => {
      var newOHA = {}
      newOHA = setIn(
        newOHA,
        ["taskOutput"],
        setAnnotations(newOHA.taskOutput, appendedTaskOutput, configImport)
      )
      if (
        json !== null &&
        typeof json !== "undefined" &&
        typeof json.content !== "undefined" &&
        typeof json.fileName !== "undefined"
      ) {
        json.content.taskData = giveSampleName(json.content.taskData)
        newOHA = setIn(
          newOHA,
          ["taskData"],
          (oha.taskData || []).concat(json.content.taskData)
        )
        newOHA = setIn(newOHA, ["interface"], json.content.interface)
        if (typeof file.fileName === "undefined" || file.fileName === "unnamed")
          file = setIn(file, ["fileName"], json.fileName)
        file = setIn(file, ["content"], newOHA)
        onChangeFile(file, true)
      } else {
        appendedTaskData = giveSampleName(appendedTaskData)
        newOHA = setIn(
          oha,
          ["taskData"],
          (oha.taskData || []).concat(appendedTaskData)
        )
        onChangeOHA(newOHA, true)
      }

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
        <Button dialog="import-csv-json" Icon={DescriptionIcon}>
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
          file={file}
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
