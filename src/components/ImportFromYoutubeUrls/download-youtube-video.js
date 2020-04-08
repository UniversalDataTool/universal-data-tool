export default ({ youtubeUrl, title: videoTitle, remote, videoQuality, downloadPath, onProgress, onComplete }) => {
    let starttime = Date.now()
    
    const ytdl = remote.require("ytdl-core")
    const path = remote.require("path")
    
    const fullVideoPath = path.join(downloadPath, `${videoTitle + ".mp4"}`)
    const writableVideoFile = remote.require("fs").createWriteStream(fullVideoPath)

    const youtubeVideoWithOptions = ytdl(youtubeUrl, {
        format: "video/mp4",
        quality: videoQuality !== null ? videoQuality : "highest" 
    })

    youtubeVideoWithOptions.pipe(writableVideoFile)

    youtubeVideoWithOptions.once("response", () => {
        starttime = Date.now()
    })

    youtubeVideoWithOptions.on("progress", (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60

        const downloadedPercentage = (percent * 100).toFixed(2)
        const downloadedSize = (downloaded / 1024 / 1024).toFixed(2)
        const downloadedMBs = (
          downloaded /
          1024 /
          1024
        ).toFixed(2)
        const totalSize = (total / 1024 / 1024).toFixed(2)
        const informationText = `${downloadedPercentage}% downloaded (${downloadedMBs}MB of ${totalSize}MB)\nestimated time left: ${(downloadedMinutes / percent -downloadedMinutes).toFixed(2)}minutes`
        
        onProgress({
            progress: percent * 100,
            text: informationText
        })
    })
    
    youtubeVideoWithOptions.on("end", () => onComplete(fullVideoPath))
    
    
    return {
        cancel: () => {
            youtubeVideoWithOptions.destroy()
        }
    }
    
}