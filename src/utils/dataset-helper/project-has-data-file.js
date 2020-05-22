export default (typeProject) => {
  if (
    "text_entity_recognition" === typeProject ||
    "text_classification" === typeProject
  )
    return "none"
  if (
    "video_segmentation" === typeProject ||
    "image_classification" === typeProject ||
    "image_segmentation" === typeProject ||
    "audio_transcription" === typeProject ||
    "composite" === typeProject ||
    "data_entry" === typeProject
  )
    return "file"
  return ""
}
