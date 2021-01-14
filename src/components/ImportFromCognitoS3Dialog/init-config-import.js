import checkInterfaceAndsamples from "./check-interface-and-sample-type"
import isEmpty from "lodash/isEmpty"
export default (dataset) => {
  return {
    annotationToKeep: "both",
    typeOfFileToLoad: checkInterfaceAndsamples(["Image", "Empty"], dataset)
      ? "Image"
      : checkInterfaceAndsamples(["Video", "Empty"], dataset)
      ? "Video"
      : checkInterfaceAndsamples(["Audio", "Empty"], dataset)
      ? "Audio"
      : checkInterfaceAndsamples(["PDF", "Empty"], dataset)
      ? "PDF"
      : checkInterfaceAndsamples(["Texte", "Empty"], dataset)
      ? "Texte"
      : "None",
    typeOfFileToDisable: {
      Image: !checkInterfaceAndsamples(["Image", "Empty"], dataset),
      Video: !checkInterfaceAndsamples(["Video", "Empty"], dataset),
      Audio: !checkInterfaceAndsamples(["Audio", "Empty"], dataset),
      PDF: !checkInterfaceAndsamples(["PDF", "Empty"], dataset),
      Texte: !checkInterfaceAndsamples(["Texte", "Empty"], dataset),
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted:
      isEmpty(dataset) ||
      (isEmpty(dataset.interface) && isEmpty(dataset.samples))
        ? false
        : true,
  }
}
