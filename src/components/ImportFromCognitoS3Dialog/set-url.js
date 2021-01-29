import RecognizeFileExtension from "../../utils/get-data-url-type"
const setUrl = (result, configImport) => {
  if (configImport.loadProjectIsSelected) {
    if (RecognizeFileExtension(result) === "Image") {
      return { imageUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Video") {
      return { videoUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Audio") {
      return { audioUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "PDF") {
      return { pdfUrl: `${result}` }
    } else if (RecognizeFileExtension(result) === "Text") {
      //var text = await fetchTextInFile(result)
      return { document: `Is not supported` /*${text}`*/ }
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
      //var text = await fetchTextInFile(result)
      return { document: `Is not supported` /*${text}`*/ }
    }
  }
}
export default setUrl
