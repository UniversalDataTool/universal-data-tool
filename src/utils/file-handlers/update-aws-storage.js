import Amplify, { Auth, Storage } from "aws-amplify"

export default (file) => {
  async function fetchAnImage(element) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/"
    var response
    if (typeof element.imageUrl !== "undefined") {
      response = await fetch(proxyUrl + element.imageUrl).catch((error) => {
        console.log("Looks like there was a problem: \n", error)
      })
    } else {
      response = await fetch(proxyUrl + element.videoUrl, {
        method: "GET",
        headers: {
          "X-Requested-With": "xmlhttprequest",
        },
      }).catch((error) => {
        console.log("Looks like there was a problem: \n", error)
      })
    }
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
    file.content.taskData.forEach(async (element) => {
      try {
        const blob = await fetchAnImage(element)
        let imageOrVideoName
        if (typeof element.sampleName === "undefined") {
          if (typeof element.imageUrl !== "undefined") {
            imageOrVideoName = element.imageUrl.match(
              `\\/([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`
            )[1]
          } else {
            imageOrVideoName = element.videoUrl.match(
              `\\/([^\\/\\\\&\\?]*\\.([a-zA-Z0-9]*))(\\?|$)`
            )[1]
          }
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
  
  if (fileNameExist(file)) {
    var json = JSON.stringify(file)
    createOrReplaceProjectFile(file)
    createOrReplaceAnnotations(file, json)
    createOrReplaceImages(file)
  }
}
