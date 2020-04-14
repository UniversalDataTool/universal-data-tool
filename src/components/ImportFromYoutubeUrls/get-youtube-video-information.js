const getYoutubeVideoInformation = async (
  remote,
  splittedURLsArray,
  progressCallback = () => null
) => {
  const ytdl = remote.require("ytdl-core")
  const checkedVideos = []
  if (splittedURLsArray.length > 0) {
    for (let i = 0; i < splittedURLsArray.length; i++) {
      const url = splittedURLsArray[i]
      const video = await new Promise((resolve, reject) => {
        ytdl.getBasicInfo(url, (err, info) => {
          if (info && !err) {
            resolve({
              url,
              title: info.title,
            })
          } else {
            const errorText = `Error with video at "${url}"\n\n${err.toString()}`
            reject(new Error(errorText))
          }
        })
      })
      checkedVideos.push(video)
      progressCallback({
        progress: (i / (splittedURLsArray.length - 1)) * 100,
        text: "Inspecting Video Information...",
      })
    }
  }
  return checkedVideos
}

export default getYoutubeVideoInformation
