export default (sample) => {
  var sampleName
  if (typeof sample.imageUrl !== "undefined") {
    sampleName = decodeURI(sample.imageUrl).match(
      `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
    )
  } else {
    sampleName = decodeURI(sample.videoUrl).match(
      `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
    )
  }
  return sampleName
}
