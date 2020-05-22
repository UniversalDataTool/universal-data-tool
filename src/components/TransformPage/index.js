// @flow weak

import React, { useState, createContext } from "react"
import MuiButton from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import ImageIcon from "@material-ui/icons/Image"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import * as colors from "@material-ui/core/colors"
import useIsDesktop from "../../utils/use-is-desktop"
import classnames from "classnames"
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo"
import TransformVideoKeyframesDialog from "../TransformVideoKeyframesDialog"
import DownloadURLsDialog from "../DownloadURLsDialog"
import GetAppIcon from "@material-ui/icons/GetApp"
import CollectionsIcon from "@material-ui/icons/Collections"
import TransformVideoFramesToImagesDialog from "../TransformVideoFramesToImagesDialog"
import usePosthog from "../../utils/use-posthog"
import TransformLocalFilesToWebURLs from "../TransformLocalFilesToWebURLs"
import TransformImageSamplesIntoSegmentsDialog from "../TransformImageSamplesIntoSegmentsDialog"

import ComputerIcon from "@material-ui/icons/Computer"
import LanguageIcon from "@material-ui/icons/Language"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import GridOnIcon from "@material-ui/icons/GridOn"

import { useTranslation } from 'react-i18next';

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
    width: 36,
    height: 36,
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

const Button = ({ Icon1, Icon2, desktopOnly, children, dialog, disabled }) => {
  const isDesktop = useIsDesktop()
  const posthog = usePosthog()
  const { t, i18n } = useTranslation()
  
  disabled =
    disabled === undefined ? (desktopOnly ? !isDesktop : false) : disabled
  return (
    <SelectDialogContext.Consumer>
      {({ onChangeDialog }) => {
        return (
          <ButtonBase
            onClick={() => {
              onChangeDialog(dialog)
              posthog.capture("transform_button_clicked", {
                transform_button: dialog,
              })
            }}
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
                  {(t("desktop-only")).toUpperCase()}
                </DesktopOnlyText>
              )}
            </div>
          </ButtonBase>
        )
      }}
    </SelectDialogContext.Consumer>
  )
}

export default ({ dataset, onChangeDataset }) => {
  const { t, i18n } = useTranslation()
  const [selectedDialog, changeDialog] = useState()
  const onChangeDialog = async (dialog) => {
    switch (dialog) {
      case "convert-keyframes-to-samples": {
        break
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
          disabled={dataset.interface.type !== "video_segmentation"}
          dialog="convert-keyframes-to-samples"
          Icon1={OndemandVideoIcon}
          Icon2={CollectionsIcon}
        >
          {t("convert-video-keyframes-to-samples")}
        </Button>
        <Button
          desktopOnly
          dialog="convert-local-files-to-web-urls"
          Icon1={ComputerIcon}
          Icon2={LanguageIcon}
        >
          {t("transform-local-files-to-web-urls")}
        </Button>
        <Button desktopOnly dialog="download-urls" Icon1={GetAppIcon}>
          {t("download")} URLs
        </Button>
        <Button
          desktopOnly
          dialog="convert-video-frames-to-images"
          Icon1={OndemandVideoIcon}
          Icon2={ImageIcon}
        >
          {t("convert-video-frames-to-images")}
        </Button>
        <Button
          dialog="split-image-samples-into-segments"
          Icon1={CheckBoxOutlineBlankIcon}
          Icon2={GridOnIcon}
        >
          Split Image Samples into Segments
        </Button>
        <TransformVideoKeyframesDialog
          open={selectedDialog === "convert-keyframes-to-samples"}
          onClose={closeDialog}
          dataset={dataset}
          onChangeDataset={(...args) => {
            onChangeDataset(...args)
            closeDialog()
          }}
        />
        <DownloadURLsDialog
          open={selectedDialog === "download-urls"}
          onClose={closeDialog}
          dataset={dataset}
          desktopOnly
          onChangeDataset={onChangeDataset}
        ></DownloadURLsDialog>
        <TransformLocalFilesToWebURLs
          dataset={dataset}
          onClose={closeDialog}
          onChangeDataset={onChangeDataset}
          desktopOnly
          open={selectedDialog === "convert-local-files-to-web-urls"}
        ></TransformLocalFilesToWebURLs>
        <TransformVideoFramesToImagesDialog
          open={selectedDialog === "convert-video-frames-to-images"}
          onClose={closeDialog}
          dataset={dataset}
          desktopOnly
          onChangeDataset={onChangeDataset}
        ></TransformVideoFramesToImagesDialog>
        <TransformImageSamplesIntoSegmentsDialog
          dataset={dataset}
          open={selectedDialog === "split-image-samples-into-segments"}
          onClose={closeDialog}
          onChangeDataset={onChangeDataset}
        ></TransformImageSamplesIntoSegmentsDialog>
      </div>
    </SelectDialogContext.Provider>
  )
}
