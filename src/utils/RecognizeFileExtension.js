import isEmpty from "lodash/isEmpty"
export default (UrlOfAFile) => {
  var typeOfFile = "File"
  var fileExtension = UrlOfAFile.match(
    `\\/?([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`
  )
  if (!isEmpty(fileExtension)) {
    fileExtension = fileExtension[2].toLowerCase()
  }
  if (
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "png" ||
    fileExtension === "ico" ||
    fileExtension === "jpe" ||
    fileExtension === "gif" ||
    fileExtension === "webp" ||
    fileExtension === "jfif"
  )
    typeOfFile = "Image"
  if (fileExtension === "mp4" || fileExtension === "mkv") typeOfFile = "Video"
  if (fileExtension === "mp3") typeOfFile = "Audio"
  if (fileExtension === "pdf") typeOfFile = "PDF"
  if (fileExtension === "txt") typeOfFile = "Text"
  return typeOfFile
}
