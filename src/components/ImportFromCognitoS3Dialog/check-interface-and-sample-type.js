import isEmpty from "lodash/isEmpty"
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
  if (type === "time_series") return "Time"
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
  if (!isEmpty(assets[0].timeData)) return "Time"
  return "File"
}
export default (typeAuthorizeInterface, typeAuthorizeAssets, file) => {
  var result = [null, null]
  if (isEmpty(file)) return false
  result[0] = interfaceFileType(file.interface.type)
  result[1] = typeAssetsFromSample(file.samples)
  if (
    typeAuthorizeInterface.includes(result[0]) &&
    typeAuthorizeAssets.includes(result[1])
  )
    return true
  return false
}
