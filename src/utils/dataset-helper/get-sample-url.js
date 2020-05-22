export default (sample) => {
  return (
    sample.imageUrl ||
    sample.videoUrl ||
    sample.audioUrl ||
    sample.pdfUrl ||
    sample.textUrl ||
    undefined
  )
}
