export default (UrlOfAFile) => {
    var typeOfFile = "File"
    var fileExtension = UrlOfAFile.match(
      `\\/([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`
    )[2].toLowerCase()
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png" ||
      fileExtension === "ico" ||
      fileExtension === "jpe" ||
      fileExtension === "gif"
    )
      typeOfFile = "Image"
    if (fileExtension === "mp4" || fileExtension === "mkv") typeOfFile = "Video"
    if (fileExtension === "mp3") typeOfFile = "Audio"
    return typeOfFile
  }