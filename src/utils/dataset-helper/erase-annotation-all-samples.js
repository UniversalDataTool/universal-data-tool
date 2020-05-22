import isEmpty from "lodash/isEmpty"
export default (samples) => {
  var samplesWithoutAnnotation = []
  for (let i = 0; i < samples.length; i++) {
    let Newsample = samples[i]
    if (!isEmpty(Newsample.annotation)) {
      delete Newsample["annotation"]
    }
    samplesWithoutAnnotation.push(Newsample)
  }
  return samplesWithoutAnnotation
}
