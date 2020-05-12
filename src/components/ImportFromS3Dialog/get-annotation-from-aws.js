import isEmpty from "../../utils/isEmpty"
import Amplify, { Storage } from "aws-amplify"
import jsonHandler from "../../utils/file-handlers/udt-helper"
function CheckIfAnnotationExist(result, folderToFetch) {
  return result.find(
    (element) => element.key === `${folderToFetch}/annotations/annotations.json`
  )
}

function GetSampleFromAnnotation(json, samples) {
  if (isEmpty(json.content.samples)) return
  var newSamples = []
  for (var i = 0; i < json.content.samples.length; i++) {
    var sampleName = jsonHandler.getSampleName(json.content.samples[i])
    var annotation = json.content.samples[i].annotation
    var sampleFound = jsonHandler.getSampleWithThisSampleName(
      sampleName,
      samples
    )
    var url
    if (sampleFound === null) {
      url = jsonHandler.getSampleUrl(samples)
    } else {
      url = jsonHandler.getSampleUrl(sampleFound)
    }
    newSamples.push(jsonHandler.createOneNewSample(sampleName, url, annotation))
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
