const getFileURLKey = (item) => {
  if (item.imageUrl) return "imageUrl"
  if (item.videoUrl) return "videoUrl"
  if (item.audioUrl) return "audioUrl"
  return null
}

export default getFileURLKey
