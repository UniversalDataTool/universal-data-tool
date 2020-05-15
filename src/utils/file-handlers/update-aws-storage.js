import { Storage } from "aws-amplify"
import isEmpty from "../isEmpty"
import jsonHandler from "./udt-helper"
import { setIn } from "seamless-immutable"
export default (file) => {
  async function fetchAFile(element) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/"
    var response
    var url
    if (jsonHandler.getSampleUrl(element) !== undefined)
      url = proxyUrl + jsonHandler.getSampleUrl(element)
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
    if (!isEmpty(file.content.samples)) {
      file.content.samples.forEach(async (element,index) => {
        try {
          var blob
          if (!isEmpty(jsonHandler.getSampleUrl(element))) {
            blob = await fetchAFile(element)
          } else if (!isEmpty(element.document)||!isEmpty(element.textUrl)) {
            blob = await jsonHandler.getTextfromSample(element)
          }

          let imageOrVideoName
          if (isEmpty(element.sampleName)) {
            imageOrVideoName = jsonHandler.getSampleName(element,index)[1]
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
    var content = file.content
    var samples = content.samples
    file = setIn(
      file,
      ["content"],
      setIn(content, ["samples"], jsonHandler.setSamplesName(samples))
    )
    var json = JSON.stringify(file)
    createOrReplaceProjectFile(file)
    createOrReplaceAnnotations(file, json)
    createOrReplaceImages(file)
  }
}
