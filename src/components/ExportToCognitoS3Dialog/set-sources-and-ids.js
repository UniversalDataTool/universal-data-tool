import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import { setIn } from "seamless-immutable"
import fetchAFile from "./fetch-a-file"
const createJsonFromUrlAWS = async (projectName, json, dm, configExport) => {
  var url = await dm.getAssetUrl(json._id, projectName)
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
    var text = await dm.getSampleText({ txtUrl: `${url}` })
    json = { document: `${text}` }
  }
  if (json) json = setIn(json, ["_id"], json._id)
  if (json) json = setIn(json, ["source"], projectName)
  return json
}

const setSourcesAndIds = async (projectName, jsons, dm) => {
  jsons = await Promise.all(
    jsons.map(async (json) => {
      json = await createJsonFromUrlAWS(projectName, json, dm)
      return json
    })
  )
  return jsons
}
export default setSourcesAndIds
