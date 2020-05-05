// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import useElectron from "../../utils/use-electron"
import ProgressBar from "../ProgressBar"
import md5 from "js-md5"
import path from "path"
import { setIn } from "seamless-immutable"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

function downloadFile(urlToDownload, directoryPath, remote) {
  const fileName = `sample_${md5(urlToDownload).slice(0, 6)}__${urlToDownload
    .split("/")
    .slice(-1)[0]
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")}`
  const downloadPath = path.join(directoryPath, fileName)
  if (remote.require("fs").existsSync(downloadPath)) return downloadPath
  return new Promise((resolve, reject) => {
    remote.require("download-file")(
      urlToDownload,
      {
        directory: directoryPath,
        filename: fileName,
      },
      (err) => {
        if (err) return reject(err)
        return resolve(downloadPath)
      }
    )
  })
}

export default ({ open, onChangeOHA, onClose, oha }) => {
  const { remote } = useElectron() || {}
  const [progress, changeProgress] = useState(null)
  const [errors, changeErrors] = useState("")
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Download URLs"
      actions={[
        {
          text: "Download URLs",
          disabled: progress !== null,
          onClick: async () => {
            changeProgress(0)
            const {
              cancelled,
              filePaths: [directoryPath] = [null],
            } = await remote.dialog.showOpenDialog({
              title: "Directory to download files to",
              buttonLabel: "Download Files Here",
              properties: [
                "createDirectory",
                "openDirectory",
                "promptToCreate",
              ],
            })
            if (cancelled || !directoryPath) {
              changeProgress(null)
              return
            }

            const newSamples = [...oha.samples]
            let errors = ""

            // Iterate over each task datum and download the url, then convert
            // the path to a filesystem path
            for (let i = 0; i < oha.samples.length; i++) {
              const td = oha.samples[i]
              let urlKey
              if (td.imageUrl) urlKey = "imageUrl"
              if (td.videoUrl) urlKey = "videoUrl"
              if (!urlKey || !td[urlKey].startsWith("http")) continue
              const urlToDownload = td[urlKey]
              try {
                const pathToFile = await downloadFile(
                  urlToDownload,
                  directoryPath,
                  remote
                )
                newSamples[i] = {
                  ...td,
                  [urlKey]: `file://${pathToFile}`,
                }
              } catch (e) {
                errors += `Skipping sample, error downloading samples[${i}] (${urlToDownload}): ${e.toString()} \n`
              }
              changeProgress((i / oha.samples.length) * 100)
            }

            onChangeOHA(setIn(oha, ["samples"], newSamples))

            changeErrors(errors)
            changeProgress(100)
          },
        },
      ]}
    >
      This transformation will download all the urls from your samples to your
      computer, and change the paths to filenames. This is usually not a good
      idea if you're collaborating with others, but is very useful if you're
      about to build a model.
      <ProgressBar progress={progress || 0} />
      {errors && <ErrorBox>{errors}</ErrorBox>}
    </SimpleDialog>
  )
}
