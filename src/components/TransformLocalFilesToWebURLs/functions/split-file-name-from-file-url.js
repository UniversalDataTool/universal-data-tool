const splitFileNameFromFileURL = (fileURL) => {
  if (fileURL.startsWith("file://")) {
    const splittedFullFileName = fileURL.split("/")
    const fullFileName = splittedFullFileName[splittedFullFileName.length - 1]
    return fullFileName
  }
}

export default splitFileNameFromFileURL
