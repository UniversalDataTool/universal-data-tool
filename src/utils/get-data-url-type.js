import isEmpty from "lodash/isEmpty"
import mime from "mime-types"
export default (UrlOfAFile) => {
  var typeOfFile = "File"
  var fileExtension = UrlOfAFile.match(
    `\\/?([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`
  )
  if (!isEmpty(fileExtension)) {
    fileExtension = fileExtension[2].toLowerCase()
  }
  if (mime.lookup(fileExtension).match("image\\/.*")) typeOfFile = "Image"
  if (mime.lookup(fileExtension).match("video\\/.*")) typeOfFile = "Video"
  if (mime.lookup(fileExtension).match("audio\\/.*")) typeOfFile = "Audio"
  if (mime.lookup(fileExtension).match("application\\/pdf")) typeOfFile = "PDF"
  if (mime.lookup(fileExtension).match("text\\/.*")) typeOfFile = "Text"
  return typeOfFile
}
