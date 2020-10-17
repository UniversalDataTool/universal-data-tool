// @flow weak

import React, { useState, createContext } from "react"
import ImageIcon from "@material-ui/icons/Image"
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo"
import TransformVideoKeyframesDialog from "../TransformVideoKeyframesDialog"
import DownloadURLsDialog from "../DownloadURLsDialog"
import GetAppIcon from "@material-ui/icons/GetApp"
import CollectionsIcon from "@material-ui/icons/Collections"
import TransformVideoFramesToImagesDialog from "../TransformVideoFramesToImagesDialog"
import TransformLocalFilesToWebURLs from "../TransformLocalFilesToWebURLs"
import TransformImageSamplesIntoSegmentsDialog from "../TransformImageSamplesIntoSegmentsDialog"
import TransformSegmentsIntoImageSamplesDialog from "../TransformSegmentsIntoImageSamplesDialog"
import TransformRemoveInvalidSamplesDialog from "../TransformRemoveInvalidSamplesDialog"
import { usePlugins } from "../PluginProvider"
import PluginDialog from "../PluginDialog"
import useInterface from "../../hooks/use-interface"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import Button from "./Button"

import PeopleAltIcon from "@material-ui/icons/PeopleAlt"
import ComputerIcon from "@material-ui/icons/Computer"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import LanguageIcon from "@material-ui/icons/Language"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import GridOnIcon from "@material-ui/icons/GridOn"

import { useTranslation } from "react-i18next"

export const SelectDialogContext = createContext()

export default () => {
  const { t } = useTranslation()
  const [selectedDialog, changeDialog] = useState()
  const { iface } = useInterface()
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
  const [openPlugin, setOpenPlugin] = useState(null)
  const plugins = usePlugins()
  const [datasetManager] = useActiveDatasetManager()

  return (
    <SelectDialogContext.Provider value={{ onChangeDialog }}>
      <div>
        <Button
          disabled={iface?.type !== "video_segmentation"}
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
        <Button
          dialog="combine-segments-into-image-samples"
          Icon1={GridOnIcon}
          Icon2={CheckBoxOutlineBlankIcon}
        >
          Combine Segments into Image Samples
        </Button>
        <Button
          dialog="remove-invalid-samples"
          Icon1={ImageIcon}
          Icon2={HighlightOffIcon}
        >
          Remove Invalid Samples
        </Button>
        {plugins.map((plugin) => (
          <Button
            key={plugin.name}
            Icon1={PeopleAltIcon}
            Icon2={PeopleAltIcon}
            onClick={() => setOpenPlugin(plugin)}
          >
            {plugin.name}
          </Button>
        ))}
        {openPlugin && (
          <PluginDialog
            open={Boolean(openPlugin)}
            onClose={() => setOpenPlugin(null)}
            {...openPlugin}
            datasetManager={datasetManager}
          />
        )}
        <TransformRemoveInvalidSamplesDialog
          open={selectedDialog === "remove-invalid-samples"}
          onClose={closeDialog}
        />
        <TransformVideoKeyframesDialog
          open={selectedDialog === "convert-keyframes-to-samples"}
          onClose={closeDialog}
        />
        <DownloadURLsDialog
          open={selectedDialog === "download-urls"}
          onClose={closeDialog}
          desktopOnly
        ></DownloadURLsDialog>
        <TransformLocalFilesToWebURLs
          onClose={closeDialog}
          desktopOnly
          open={selectedDialog === "convert-local-files-to-web-urls"}
        ></TransformLocalFilesToWebURLs>
        <TransformVideoFramesToImagesDialog
          open={selectedDialog === "convert-video-frames-to-images"}
          onClose={closeDialog}
          desktopOnly
        ></TransformVideoFramesToImagesDialog>
        <TransformImageSamplesIntoSegmentsDialog
          open={selectedDialog === "split-image-samples-into-segments"}
          onClose={closeDialog}
        ></TransformImageSamplesIntoSegmentsDialog>
        <TransformSegmentsIntoImageSamplesDialog
          open={selectedDialog === "combine-segments-into-image-samples"}
          onClose={closeDialog}
        ></TransformSegmentsIntoImageSamplesDialog>
      </div>
    </SelectDialogContext.Provider>
  )
}
