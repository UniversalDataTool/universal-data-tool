import isEmpty from "lodash/isEmpty"
import Amplify, { Storage } from "aws-amplify"
import getSampleName from "../../utils/dataset-helper/get-sample-name"
import getSampleUrl from "../../utils/dataset-helper/get-sample-url"
import getSampleWithName from "../../utils/dataset-helper/get-sample-with-name"
import constructSample from "../../utils/dataset-helper/construct-sample"

function CheckIfAnnotationExist(result, folderToFetch) {
  return result.find(
    (element) => element.key === `${folderToFetch}/annotations/annotations.json`
  )
}

function GetSampleFromAnnotation(json, samples) {
  if (isEmpty(json.content.samples)) return
  var newSamples = []
  for (var i = 0; i < json.content.samples.length; i++) {
    var sampleName = getSampleName(json.content.samples[i], i)[1]
    var annotation = json.content.samples[i].annotation
    var sampleFound = getSampleWithName(sampleName, samples)
    var url
    if (sampleFound === null) {
      url = getSampleUrl(samples)
    } else {
      url = getSampleUrl(sampleFound)
    }
    newSamples.push(constructSample(sampleName, url, annotation))
  }
  json.content.samples = newSamples
}

export default async (result, samples, folderToFetch, authConfig) => {
  Amplify.configure(authConfig)

  var json = null
  if (CheckIfAnnotationExist(result, folderToFetch)) {
    await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
      expires: 24 * 60 * 60 * 2000,
      level: "private",
    })
      .then(async (result) => {
        await fetch(result).then(async (data) => {
          return await data.json().then(async (result) => {
            if (typeof result.content === "undefined") return
            json = result
            GetSampleFromAnnotation(json, samples)
          })
        })
      })
      .catch((err) => {
        console.log("error getting link for s3 image", err)
        return null
      })
  }
  return json
}
