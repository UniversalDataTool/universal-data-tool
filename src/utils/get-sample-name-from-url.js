export default (sample) => {
  var sampleName
  if (typeof sample.imageUrl !== "undefined") {
    sampleName = sample.imageUrl.match(
      `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
    )
  } else {
    sampleName = sample.videoUrl.match(
      `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
    )
  }
  return sampleName
}
