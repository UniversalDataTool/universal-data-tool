import getSampleNameFromURL from "../../utils/get-sample-name-from-url"
import isEmpty from "../../utils/isEmpty"
import Amplify, { Storage } from "aws-amplify"

function CheckIfAnnotationExist(result, folderToFetch){
  return result.find(
    (element) =>
      element.key === `${folderToFetch}/annotations/annotations.json`
  )
}

function ReadSampleNameFromJsonOrFromUrl(sample){
  var sampleName
  if (
    typeof sample.sampleName !== "undefined"
  ) {
    sampleName = sample.sampleName
  } else {
    sampleName = getSampleNameFromURL(
      sample
    )[1]
  }
  return sampleName
}

function setOneNewSample(newSamples,sampleName,samples){
  for (var y = 0; y < samples.length; y++) {
    var sampleToCheck = getSampleNameFromURL(samples[y])
    if (
      sampleName === sampleToCheck[1]
    ) {
      newSamples.push({
        imageUrl: samples[y].imageUrl,
        sampleName: sampleName,
      })
    }
  }
  return newSamples
}

export default async (result, samples, folderToFetch, authConfig) => {
  Amplify.configure(authConfig)
  var json = null
  if ( CheckIfAnnotationExist(result,folderToFetch) ) {
    await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
      expires: 24 * 60 * 60 * 2000,
      level: "private",
    }).then(async (result) => {
        await fetch(result).then(async (data) => {
          return await data.json().then(async (result) => {
            
            if (typeof result.content === "undefined") return
            json = result

            if(isEmpty(json.content.taskData)) return
            var newSamples = []
            for (var i = 0; i < json.content.taskData.length; i++) {
              var sampleName = ReadSampleNameFromJsonOrFromUrl(json.content.taskData[i])
              newSamples =setOneNewSample(newSamples,sampleName,samples)
            }
            json.content.taskData = newSamples
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
