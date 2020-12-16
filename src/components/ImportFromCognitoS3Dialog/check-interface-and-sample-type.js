import isEmpty from "lodash/isEmpty"
export default (typeAuthorize, file) => {
  const interfaceFileType = (type) => {
    if (
      type === "image_classification" ||
      type === "image_segmentation" ||
      type === "composite"
    )
      return "Image"
    if (type === "video_segmentation") return "Video"
    if (type === "audio_transcription") return "Audio"
    if (type === "data_entry") return "PDF"
    if (type === "text_entity_recognition" || type === "text_classification")
      return "Text"
    if (isEmpty(type)) return "Empty"
    return "File"
  }

  const typeAssetsFromSample = (assets) => {
    if (isEmpty(assets) || isEmpty(assets[0])) return "Empty"
    if (!isEmpty(assets[0].imageUrl)) return "Image"
    if (!isEmpty(assets[0].videoUrl)) return "Video"
    if (!isEmpty(assets[0].audioUrl)) return "Audio"
    if (!isEmpty(assets[0].pdfUrl)) return "PDF"
    if (!isEmpty(assets[0].document)) return "Text"
    return "File"
  }

  var result = [null, null]
  if (isEmpty(file)) return false
  result[0] = interfaceFileType(file.interface.type)
  result[1] = typeAssetsFromSample(file.samples)
  if (typeAuthorize.includes(result[0]) && typeAuthorize.includes(result[1]))
    return true
  return false
}
