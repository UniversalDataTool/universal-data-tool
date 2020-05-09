import isEmpty from "./isEmpty"
export default (sample) => {
  var sampleName
  if (!isEmpty(sample)) {
    if (!isEmpty(sample.imageUrl)) {
      sampleName = sample.imageUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    if (!isEmpty(sample.videoUrl)) {
      sampleName = sample.videoUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    if (!isEmpty(sample.audioUrl)) {
      sampleName = sample.audioUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
  }
  return sampleName
}
