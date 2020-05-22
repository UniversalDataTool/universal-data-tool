import getSampleNameFromURL from "./get-sample-name-from-url"
import isEmpty from "lodash/isEmpty"
import { setIn } from "seamless-immutable"
export default (dataset, sampleName) => {
  if (!dataset || !dataset.samples || !sampleName) return null
  const { samples } = dataset
  for (var i = 0; i < samples.length; i++) {
    if (!isEmpty(samples[i])) {
      var nameToSearch = getSampleNameFromURL(samples[i])
      if (!isEmpty(samples[i].sampleName)) {
        nameToSearch = setIn(nameToSearch, [1], samples[i].sampleName)
      }
      if (nameToSearch[1] === sampleName) {
        return samples[i]
      }
    }
  }
  return null
}
