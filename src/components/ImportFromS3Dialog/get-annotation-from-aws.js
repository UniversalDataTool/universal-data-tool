import getSampleNameFromURL from "../../utils/get-sample-name-from-url"
import isEmpty from "../../utils/isEmpty"
import Amplify, { Storage } from "aws-amplify"

function CheckIfAnnotationExist(result, folderToFetch) {
  return result.find(
    (element) => element.key === `${folderToFetch}/annotations/annotations.json`
  )
}

function ReadSampleNameFromJsonOrFromUrl(sample) {
  var sampleName
  if (typeof sample.sampleName !== "undefined") {
    sampleName = sample.sampleName
  } else {
    sampleName = getSampleNameFromURL(sample)[1]
  }
  return sampleName
}

function setOneNewSample(newSamples, sampleName, samples, annotation) {
  for (var y = 0; y < samples.length; y++) {
    var sampleToCheck = getSampleNameFromURL(samples[y])
    if (sampleName === sampleToCheck[1]) {
      if (isEmpty(annotation)) {
        if (!isEmpty(samples[y].imageUrl)) {
          newSamples.push({
            imageUrl: samples[y].imageUrl,
            sampleName: sampleName,
          })
        }
        if (!isEmpty(samples[y].videoUrl)) {
          newSamples.push({
            videoUrl: samples[y].videoUrl,
            sampleName: sampleName,
          })
        }
        if (!isEmpty(samples[y].audioUrl)) {
          newSamples.push({
            audioUrl: samples[y].audioUrl,
            sampleName: sampleName,
          })
        }
      } else {
        if (!isEmpty(samples[y].imageUrl)) {
          newSamples.push({
            annotation: annotation,
            imageUrl: samples[y].imageUrl,
            sampleName: sampleName,
          })
        }
        if (!isEmpty(samples[y].videoUrl)) {
          newSamples.push({
            annotation: annotation,
            videoUrl: samples[y].videoUrl,
            sampleName: sampleName,
          })
        }
        if (!isEmpty(samples[y].audioUrl)) {
          newSamples.push({
            annotation: annotation,
            audioUrl: samples[y].audioUrl,
            sampleName: sampleName,
          })
        }
      }
    }
  }
  return newSamples
}

function GetSampleFromAnnotation(json, samples, configImport) {
  if (isEmpty(json.content.samples)) return
  var newSamples = []
  for (var i = 0; i < json.content.samples.length; i++) {
    var sampleName = ReadSampleNameFromJsonOrFromUrl(json.content.samples[i])
    var annotation = json.content.samples[i].annotation
    newSamples = setOneNewSample(newSamples, sampleName, samples, annotation)
  }
  json.content.samples = newSamples
}

export default async (
  result,
  samples,
  folderToFetch,
  authConfig,
  configImport
) => {
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

            GetSampleFromAnnotation(json, samples, configImport)
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
