import isEmpty from "lodash/isEmpty"
import getSampleNameFromURL from "./get-sample-name-from-url"
import renameSampleFromUrl from "./rename-sample-from-url"
import { setIn } from "seamless-immutable"
export default (dataset) => {
  if (!dataset || !dataset.samples) return
  for (var i = 0; i < dataset.samples.length; i++) {
    if (isEmpty(dataset.samples[i])) continue
    var oldsample = dataset.samples[i]
    var sampleName
    if (!isEmpty(oldsample.document)) {
      // Deal with the exception of the text file (they don't have url)
      sampleName = [
        oldsample.document,
        "sample" + i.toString() + ".txt",
        "sample",
        "txt",
      ]
    } else {
      sampleName = getSampleNameFromURL(oldsample)
      sampleName = renameSampleFromUrl(dataset, oldsample, sampleName)
    }
    oldsample = setIn(oldsample, ["sampleName"], sampleName[1])
    dataset = setIn(dataset, ["samples", i], oldsample)
  }
  return dataset
}
