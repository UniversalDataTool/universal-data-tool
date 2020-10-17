// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import useElectron from "../../hooks/use-electron"
import ProgressBar from "../ProgressBar"
import md5 from "js-md5"
import path from "path"
import { setIn } from "seamless-immutable"

import { useTranslation } from "react-i18next"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

function downloadFile(urlToDownload, directoryPath, remote) {
  const fileName = `sample_${md5(urlToDownload).slice(0, 6)}__${urlToDownload
    .split("/")
    .slice(-1)[0]
    .replace(/[^a-zA-Z0-9_\-.]/g, "")}`
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

export default ({ open, onChangeDataset, onClose, dataset }) => {
  const { remote } = useElectron() || {}
  const [progress, changeProgress] = useState(null)
  const [errors, changeErrors] = useState("")

  const { t } = useTranslation()

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

            const newSamples = [...dataset.samples]
            let errors = ""

            // Iterate over each task datum and download the url, then convert
            // the path to a filesystem path
            for (let i = 0; i < dataset.samples.length; i++) {
              const td = dataset.samples[i]
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
              changeProgress((i / dataset.samples.length) * 100)
            }

            onChangeDataset(setIn(dataset, ["samples"], newSamples))

            changeErrors(errors)
            changeProgress(100)
          },
        },
      ]}
    >
      {t("download-urls-dialog")}
      <ProgressBar progress={progress || 0} />
      {errors && <ErrorBox>{errors}</ErrorBox>}
    </SimpleDialog>
  )
}
