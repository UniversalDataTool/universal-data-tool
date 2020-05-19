import isEmpty from "lodash/isEmpty"
export default (typeAuthorize, file) => {
  function interfaceFileType(type) {
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
      return "Texte"
    if (isEmpty(type)) return "Empty"
    return "File"
  }

  function typesamplesSample(samples) {
    if (isEmpty(samples) || isEmpty(samples[0])) return "Empty"
    if (!isEmpty(samples[0].imageUrl)) return "Image"
    if (!isEmpty(samples[0].videoUrl)) return "Video"
    if (!isEmpty(samples[0].audioUrl)) return "Audio"
    if (!isEmpty(samples[0].pdfUrl)) return "PDF"
    if (!isEmpty(samples[0].document)) return "Texte"
    if (!isEmpty(samples[0].textUrl)) return "Texte"
    return "File"
  }
  var result = [null, null]
  if (isEmpty(file)) return false
  result[0] = interfaceFileType(file.content.interface.type)
  result[1] = typesamplesSample(file.content.samples)
  if (typeAuthorize.includes(result[0]) && typeAuthorize.includes(result[1]))
    return true
  return false
}
