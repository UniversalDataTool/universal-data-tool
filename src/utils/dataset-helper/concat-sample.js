import eraseAnnotationAllSamples from "./erase-annotation-all-samples"
export default (actualSamples, newSamples, annotationToKeep) => {
  var Tabsamples = actualSamples
  var Tabsamples2 = newSamples
  if (annotationToKeep === "dontKeepAnnotation") {
    Tabsamples2 = eraseAnnotationAllSamples(newSamples)
  }
  var concatSamples = Tabsamples.concat(Tabsamples2)
  return concatSamples
}
