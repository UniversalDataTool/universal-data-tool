import isEmpty from "lodash/isEmpty"
import Amplify, { Storage } from "aws-amplify"
import * as datasetHelper from "../../utils//dataset-helper"
function CheckIfAnnotationExist(result, folderToFetch) {
  return result.find(
    (element) => element.key === `${folderToFetch}/annotations/annotations.json`
  )
}

function GetSampleFromAnnotation(json, samples) {
  if (isEmpty(json.content.samples)) return
  var newSamples = []
  for (var i = 0; i < json.content.samples.length; i++) {
    var sampleName = datasetHelper.getSampleName(json.content.samples[i])
    var annotation = json.content.samples[i].annotation
    var sampleFound = datasetHelper.getSampleWithThisSampleName(
      sampleName,
      samples
    )
    var url
    if (sampleFound === null) {
      url = datasetHelper.getSampleUrl(samples)
    } else {
      url = datasetHelper.getSampleUrl(sampleFound)
    }
    newSamples.push(
      datasetHelper.createOneNewSample(sampleName, url, annotation)
    )
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
