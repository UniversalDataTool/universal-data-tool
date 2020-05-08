// @flow weak

const convertToSamplesObject = (fp) => {
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

async function promptAndGetSamplesLocalDirectory({ electron }) {
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
  return (await fs.promises.readdir(dirPath))
    .filter((fn) => fn.includes("."))
    .map((fileName) => path.join(dirPath, fileName))
    .map(convertToSamplesObject)
    .filter(Boolean)
}

export default promptAndGetSamplesLocalDirectory
