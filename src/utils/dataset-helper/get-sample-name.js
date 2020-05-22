import isEmpty from "lodash/isEmpty"
import getSampleNameFromURL from "./get-sample-name-from-url"
import { setIn } from "seamless-immutable"
export default (sample, indexSample) => {
  var sampleName
  sampleName = getSampleNameFromURL(sample)
  if (isEmpty(sampleName))
    sampleName = [
      sample.document,
      "sample" + indexSample.toString() + ".txt",
      "sample",
      "txt",
    ]
  if (!isEmpty(sample.sampleName))
    sampleName = setIn(sampleName, [1], sample.sampleName)
  return sampleName
}
