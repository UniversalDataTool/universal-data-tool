import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import { setIn } from "seamless-immutable"
const createJsonFromUrlAWS = async (projectName, imageName, dm) => {
  var url = await dm.getAssetUrl(imageName, projectName)
  var json
  if (RecognizeFileExtension(url) === "Image") {
    json = { imageUrl: `${url}` }
  } else if (RecognizeFileExtension(url) === "Video") {
    json = { videoUrl: `${url}` }
  } else if (RecognizeFileExtension(url) === "Audio") {
    json = { audioUrl: `${url}` }
  } else if (RecognizeFileExtension(url) === "PDF") {
    json = { pdfUrl: `${url}` }
  } else if (RecognizeFileExtension(url) === "Text") {
    //var text = await fetchTextInFile(url)
    json = { document: `Is not supported` /*${text}`*/ }
  }
  if (json) json = setIn(json, ["_id"], imageName)
  if (json) json = setIn(json, ["source"], projectName)
  return json
}

const setSourcesAndIds = async (projectName, jsons, dm) => {
  jsons = await Promise.all(
    jsons.map(async (json) => {
      json = await createJsonFromUrlAWS(projectName, json._id, dm)

      console.log(json)
      return json
    })
  )
  console.log(jsons)
  return jsons
}
export default setSourcesAndIds
