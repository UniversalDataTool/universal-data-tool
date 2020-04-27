import getSampleNameFromURL from "../../utils/get-sample-name-from-url"
import isEmpty from "../../utils/isEmpty"
import Amplify, { Storage } from "aws-amplify"

export default async (result, samples, folderToFetch, authConfig) => {
  Amplify.configure(authConfig)
  var json = null
  if (
    result.find(
      (element) =>
        element.key === `${folderToFetch}/annotations/annotations.json`
    )
  ) {
    await Storage.get(`${folderToFetch}/annotations/annotations.json`, {
      expires: 24 * 60 * 60 * 2000,
      level: "private",
    })
      .then(async (result) => {
        await fetch(result).then(async (data) => {
          return await data.json().then(async (result) => {
            if (typeof result.content != "undefined") {
              json = result
              if (
                typeof json.content.taskOutput !== "undefined" &&
                !isEmpty(json.content.taskOutput)
              ) {
                var newSamples = []
                for (var i = 0; i < json.content.taskOutput.length; i++) {
                  var sampleName = getSampleNameFromURL(
                    json.content.taskData[i]
                  )
                  for (var y = 0; y < samples.length; y++) {
                    if (sampleName[1] === getSampleNameFromURL(samples[y])[1]) {
                      newSamples.push(samples[y])
                    }
                  }
                }
                json.content.taskData = newSamples
              }
            }
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
