import isEmpty from "./isEmpty"
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
    fileExtension === "gif"
  )
    typeOfFile = "Image"
  if (fileExtension === "mp4" || fileExtension === "mkv") typeOfFile = "Video"
  if (fileExtension === "mp3") typeOfFile = "Audio"
  return typeOfFile
}
