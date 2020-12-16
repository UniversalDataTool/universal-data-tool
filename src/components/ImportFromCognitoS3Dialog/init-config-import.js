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
      : checkInterfaceAndsamples(["Text", "Empty"], dataset)
      ? "Text"
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
      Text: checkInterfaceAndsamples(["Text", "Empty"], dataset) ? false : true,
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
    isReady: false,
  }
}
