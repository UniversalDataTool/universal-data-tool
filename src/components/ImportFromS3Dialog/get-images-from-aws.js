import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import Amplify, { Storage } from "aws-amplify"

export default async (result, folderToFetch, configImport,authConfig) => {
    Amplify.configure(authConfig)
    var samples = []
    for (let i = 0; i < result.length; i++) {
      if (result[i].key.match(`(${folderToFetch}/data).*(\\.).*`)) {
        await Storage.get(result[i].key, {
          expires: 24 * 60 * 60 * 2000,
          level: "private",
        })
          .then((result) => {
            if (
              RecognizeFileExtension(result) ===
                configImport.typeOfFileToLoad &&
              configImport.typeOfFileToLoad === "Image"
            ) {
              samples.push({ imageUrl: `${result}` })
            } else if (
              RecognizeFileExtension(result) ===
                configImport.typeOfFileToLoad &&
              configImport.typeOfFileToLoad === "Video"
            ) {
              samples.push({ videoUrl: `${result}` })
            }
          })
          .catch((err) => {
            console.log("error getting link for s3 image", err)
            return null
          })
      }
    }
    return samples
  }
  