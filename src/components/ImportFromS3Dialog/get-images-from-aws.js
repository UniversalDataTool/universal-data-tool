import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import Amplify, { Storage } from "aws-amplify"

async function setUrl(result, configImport) {
  if (configImport.loadProjectIsSelected) {
    if (RecognizeFileExtension(result) === "Image") {
      return { imageUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Video") {
      return { videoUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Audio") {
      return { audioUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "PDF") {
      return { pdfUrl: `${result}` }
    }
  } else {
    if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "Image"
    ) {
      return { imageUrl: `${result}` }
    } else if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "Video"
    ) {
      return { videoUrl: `${result}` }
    } else if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "Audio"
    ) {
      return { audioUrl: `${result}` }
    } else if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "PDF"
    ) {
      return { pdfUrl: `${result}` }
    } else if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "Texte"
    ) {
      var texte = await fetchTextInFile(result)
      return { document: `${texte}` }
    }
  }
}
async function fetchTextInFile(urlSource) {
  var proxyUrl = "https://cors-anywhere.herokuapp.com/"
  var response
  var url
  url = proxyUrl + urlSource
  response = await fetch(url, {
    method: "GET",
  }).catch((error) => {
    console.log("Looks like there was a problem: \n", error)
  })
  const texte = await response.text()
  return texte
}
export default async (result, folderToFetch, configImport, authConfig) => {
  Amplify.configure(authConfig)
  var samples = []
  for (let i = 0; i < result.length; i++) {
    if (result[i].key.match(`(${folderToFetch}/data).*(\\.).*`)) {
      await Storage.get(result[i].key, {
        expires: 24 * 60 * 60 * 2000,
        level: "private",
      })
        .then(async (result) => {
          samples.push(await setUrl(result, configImport))
        })
        .catch((err) => {
          console.log("error getting link for s3 image", err)
          return null
        })
    }
  }
  return samples
}
