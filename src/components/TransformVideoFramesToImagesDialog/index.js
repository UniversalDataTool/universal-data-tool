// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import useElectron from "../../utils/use-electron"
import ProgressBar from "../ProgressBar"
import { setIn, without } from "seamless-immutable"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

const getFfmpegTimeCode = (ms) => {
  const cs = Math.floor(ms / 10) % 100
  const ss = Math.floor(ms / 1000) % 60
  const mn = Math.floor(ms / 1000 / 60) % 60
  const hr = Math.floor(ms / 1000 / 60 / 60)
  return [hr, ":", mn, ":", ss, ".", cs]
    .map((n) => (typeof n === "number" ? n.toString().padStart(2, "0") : n))
    .join("")
}

export default ({ open, onChangeOHA, onClose, oha }) => {
  const { remote } = useElectron() || {}
  const [progress, changeProgress] = useState(null)
  const [errors, changeErrors] = useState("")
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Convert Video Frames to Images"
      actions={[
        {
          text: "Convert Video Frames to Images",
          disabled: progress !== null,
          onClick: async () => {
            changeProgress(0)
            let errors = ""
            const pathToFfmpeg = remote.require("ffmpeg-static")
            if (!pathToFfmpeg) {
              changeErrors(
                "There was an issue using ffmpeg. Please create an issue on the github repository."
              )
            }

            const shell = remote.require("any-shell-escape")
            const { exec } = remote.require("child_process")
            const newTaskData = [...oha.taskData]
            let transformsPerformed = 0

            for (let i = 0; i < oha.taskData.length; i++) {
              const td = oha.taskData[i]
              if (td.videoUrl && td.videoFrameAt !== undefined) {
                if (td.videoUrl.startsWith("http")) {
                  errors += `Sample ${i} has a url to a video, videos must be downloaded before extracting frames.`
                  continue
                }
                transformsPerformed++

                const videoPath = td.videoUrl.replace(/^file:\/\//, "")
                const imageOutputPath =
                  videoPath + "__frameat__" + td.videoFrameAt + ".jpg"
                const ffmpegCommand = shell([
                  pathToFfmpeg,
                  "-y",
                  "-ss",
                  getFfmpegTimeCode(td.videoFrameAt),
                  "-i",
                  videoPath,
                  "-frames:v",
                  1,
                  imageOutputPath,
                ])
                await new Promise((resolve, reject) => {
                  exec(ffmpegCommand, { timeout: 5000 }, (err) => {
                    if (err) return reject(err)
                    resolve()
                  })
                })
                newTaskData[i] = {
                  ...without(
                    without(oha.taskData[i], "videoUrl"),
                    "videoFrameAt"
                  ),
                  imageUrl: `file://${imageOutputPath}`,
                }
              }
              changeProgress((i / oha.taskData.length) * 100)
            }

            if (transformsPerformed === 0) {
              errors +=
                "No transforms were performed, do all of your video samples have frames specified? You may need to convert the keyframes to samples."
            }

            onChangeOHA(setIn(oha, ["taskData"], newTaskData))

            changeErrors(errors)
            changeProgress(100)
          },
        },
      ]}
    >
      This transformation will convert samples that reference a video frame into
      an image. This is a useful step before creating a model. You can only
      convert videos that are downloaded on your computer. Note: This can take a
      little while.
      <ProgressBar progress={progress || 0} />
      {errors && <ErrorBox>{errors}</ErrorBox>}
    </SimpleDialog>
  )
}
