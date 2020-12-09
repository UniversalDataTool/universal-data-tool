import { Storage } from "aws-amplify"
import isEmpty from "lodash/isEmpty"
import * as datasetHelper from "../../dataset-helper"
import { setIn } from "seamless-immutable"

export default (file) => {
  async function fetchAFile(element) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/"
    var response
    var url
    if (datasetHelper.getSampleUrl(element) !== undefined)
      url = proxyUrl + datasetHelper.getSampleUrl(element)
    response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "xmlhttprequest",
      },
    }).catch((error) => {
      console.log("Looks like there was a problem: \n", error)
    })
    const blob = await response.blob()
    return blob
  }

  function fileNameExist(file) {
    if (file !== "undefined" && file.fileName !== "undefined") return true

    return false
  }

  function createOrReplaceProjectFile(file) {
    Storage.put(`${file.fileName}/`, null, {
      level: "private",
    }).catch((err) => console.log(err))
  }

  function createOrReplaceAnnotations(file, json) {
    Storage.put(`${file.fileName}/annotations/annotations.json`, json, {
      level: "private",
    }).catch((err) => console.log(err))
  }

  function createOrReplaceImages(file) {
    // TODO you can't have async in a forEach loop
    if (!isEmpty(file.content.samples)) {
      file.content.samples.forEach(async (element) => {
        try {
          var blob
          if (!isEmpty(datasetHelper.getSampleUrl(element))) {
            blob = await fetchAFile(element)
          } else if (!isEmpty(element.document)) {
            blob = element.document
          }

          let imageOrVideoName
          if (isEmpty(element.sampleName)) {
            imageOrVideoName = datasetHelper.getSampleName(element)
          } else {
            imageOrVideoName = element.sampleName
          }

          var pathToFile = `${file.fileName}/data/${imageOrVideoName}`
          Storage.put(pathToFile, blob, {
            level: "private",
          }).catch((err) => console.log(err))
        } catch (err) {
          console.log(err)
        }
      })
    }
  }

  if (fileNameExist(file)) {
    var dataset = file.content
    // TODO datasetHelper.setSamplesName is returning an incorrect object, it
    // should be returning an array of samples
    datasetHelper.setSamplesName(dataset)
    file = setIn(
      file,
      ["content"],
      setIn(dataset, ["samples"], datasetHelper.setSamplesName(dataset))
    )
    var json = JSON.stringify(file)
    createOrReplaceProjectFile(file)
    createOrReplaceAnnotations(file, json)
    createOrReplaceImages(file)
  }
}
