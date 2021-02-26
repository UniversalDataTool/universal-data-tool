import RecognizeFileExtension from "../../utils/get-data-url-type"
const setUrl = async (result, configImport, dm) => {
  var text
  var json
  if (!configImport.loadAssetIsSelected) {
    if (RecognizeFileExtension(result) === "Image") {
      return { imageUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Video") {
      return { videoUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Audio") {
      return { audioUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "PDF") {
      return { pdfUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Text") {
      text = await dm.getAssetText({ txtUrl: `${result}` })
      return { document: `${text}` }
    } else if (configImport.typeOfFileToLoad === "Time") {
      json = await dm.getAssetTime({ timeUrl: `${result}` })
      return json
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
      configImport.typeOfFileToLoad === "Text"
    ) {
      text = await dm.getAssetText({ txtUrl: `${result}` })
      return { document: `${text}` }
    } else if (
      RecognizeFileExtension(result) === configImport.typeOfFileToLoad &&
      configImport.typeOfFileToLoad === "Time"
    ) {
      json = await dm.getJSON(result)
      return json
    }
  }
}
export default setUrl
