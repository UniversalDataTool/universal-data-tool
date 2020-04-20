import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import transformFileURLsToWebURLs from "./functions/transform-file-urls-to-web-urls"
import ProgressBar from "../ProgressBar"
import useElectron from "../../utils/use-electron"

/*
 *
 *   ==============================================================================
 *   =================== How Uploading and Transforming works? ====================
 *   ==============================================================================
 *
 *   When user click "Convert Local Files to Web URLs" everything starts with transformFileURLsToWebURLs
 *   tranfomFileURLsToWebURLs take oha, onChangeOHA, setProgress, remote
 *   first we put file urls(oha.taskdata) to array with putFileURLsToAnArray
 *   We splitted 100 to progressunits
 *   After that we start to iterate over putFileURLsToAnArray
 *   first we set progress half of progress unit
 *   and after that we continue with taking filename from url
 *   we upload that file to "files.universaldtatool.com" and we take url as a response
 *   and we create new ohaItem with that url
 *   After iterating finish we set new OHA to currennt OHA
 *
 */

const TransformLocalFilesToWebURLs = ({ open, onClose, oha, onChangeOHA }) => {
  const [progress, setProgress] = useState(0)
  const { remote } = useElectron() || {}

  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Convert Local Files to Web URLs"
      actions={[
        {
          text: "Convert Local Files to Web URLs",
          onClick: async () =>
            await transformFileURLsToWebURLs({
              oha,
              onChangeOHA,
              setProgress,
              remote,
            }),
        },
      ]}
    >
      This transformation will upload your local samples to the cloud Note: This
      can take a little while.
      <ProgressBar progress={progress} />
    </SimpleDialog>
  )
}

export default TransformLocalFilesToWebURLs
