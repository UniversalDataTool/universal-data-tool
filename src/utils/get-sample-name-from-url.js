import isEmpty from "lodash/isEmpty"
export default (sample) => {
  var sampleName
  if (!isEmpty(sample)) {
    if (!isEmpty(sample.imageUrl)) {
      sampleName = decodeURI(sample.imageUrl).match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    if (!isEmpty(sample.videoUrl)) {
      sampleName = decodeURI(sample.videoUrl).match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    if (!isEmpty(sample.audioUrl)) {
      sampleName = decodeURI(sample.audioUrl).match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    if (!isEmpty(sample.pdfUrl)) {
      sampleName = decodeURI(sample.pdfUrl).match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
  }
  return sampleName
}
