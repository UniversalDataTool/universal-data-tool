import isEmpty from "lodash/isEmpty"
import checkInterfaceAndAssets from "./check-interface-and-sample-type"
export default (configImport, dataset) => {
  return {
    ...configImport,
    typeOfFileToLoad:
      !isEmpty(configImport) &&
      !isEmpty(configImport.typeOfFileToLoad) &&
      checkInterfaceAndAssets([configImport.typeOfFileToLoad, "Empty"], dataset)
        ? configImport.typeOfFileToLoad
        : checkInterfaceAndAssets(["Image", "Empty"], dataset)
        ? "Image"
        : checkInterfaceAndAssets(["Video", "Empty"], dataset)
        ? "Video"
        : checkInterfaceAndAssets(["Audio", "Empty"], dataset)
        ? "Audio"
        : checkInterfaceAndAssets(["PDF", "Empty"], dataset)
        ? "PDF"
        : checkInterfaceAndAssets(["Text", "Empty"], dataset)
        ? "Text"
        : "None",
    typeOfFileToDisable: {
      Image: checkInterfaceAndAssets(["Image", "Empty"], dataset)
        ? false
        : true,
      Video: checkInterfaceAndAssets(["Video", "Empty"], dataset)
        ? false
        : true,
      Audio: checkInterfaceAndAssets(["Audio", "Empty"], dataset)
        ? false
        : true,
      PDF: checkInterfaceAndAssets(["PDF", "Empty"], dataset) ? false : true,
      Text: checkInterfaceAndAssets(["Text", "Empty"], dataset) ? false : true,
    },
  }
}
