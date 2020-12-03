import checkInterfaceAndsamples from "./check-interface-and-sample-type"
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
      Image: checkInterfaceAndsamples(["Image", "Empty"], dataset)
        ? false
        : true,
      Video: checkInterfaceAndsamples(["Video", "Empty"], dataset)
        ? false
        : true,
      Audio: checkInterfaceAndsamples(["Audio", "Empty"], dataset)
        ? false
        : true,
      PDF: checkInterfaceAndsamples(["PDF", "Empty"], dataset) ? false : true,
      Texte: checkInterfaceAndsamples(["Texte", "Empty"], dataset)
        ? false
        : true,
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
    isReady: false,
  }
}
