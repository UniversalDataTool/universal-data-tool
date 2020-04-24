const idify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")

export default ({
  youtubeUrl,
  title: videoTitle,
  remote,
  videoQuality,
  downloadPath,
  onProgress,
  onComplete,
  onChangeOverallProgress,
}) => {
  //let starttime = Date.now()

  const ytdl = remote.require("ytdl-core")
  const path = remote.require("path")

  const videoName = videoQuality.includes("audio")
    ? `${idify(videoTitle) + ".mp3"}`
    : `${idify(videoTitle) + ".mp4"}`

  const fullVideoPath = path.join(downloadPath, videoName)
  const writableVideoFile = remote
    .require("fs")
    .createWriteStream(fullVideoPath)

  const videoFormat = videoName.endsWith(".mp3") ? "audio/mp3" : "video/mp4"

  const youtubeVideoWithOptions = ytdl(youtubeUrl, {
    format: videoFormat,
    quality: videoQuality !== null ? videoQuality : "highest",
  })

  youtubeVideoWithOptions.pipe(writableVideoFile)

  /*youtubeVideoWithOptions.once("response", () => {
    starttime = Date.now()
  })*/

  youtubeVideoWithOptions.on("progress", (chunkLength, downloaded, total) => {
    const percent = downloaded / total
    // const downloadedMinutes = (Date.now() - starttime) / 1000 / 60

    // const downloadedPercentage = (percent * 100).toFixed(2)
    // const downloadedSize = (downloaded / 1024 / 1024).toFixed(2)
    // const downloadedMBs = (
    //   downloaded /
    //   1024 /
    //   1024
    // ).toFixed(2)
    // const totalSize = (total / 1024 / 1024).toFixed(2)
    // const informationText = `${downloadedPercentage}% downloaded (${downloadedMBs}MB of ${totalSize}MB)\nestimated time left: ${(downloadedMinutes / percent -downloadedMinutes).toFixed(2)}minutes`

    onProgress({
      progress: percent * 100,
    })

    onChangeOverallProgress(percent * 100)
  })

  youtubeVideoWithOptions.on("end", () => onComplete(fullVideoPath))

  return {
    cancel: () => {
      youtubeVideoWithOptions.destroy()
    },
  }
}
