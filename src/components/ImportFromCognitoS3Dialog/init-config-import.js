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
      Image: !checkInterfaceAndsamples(["Image", "Empty"], dataset),
      Video: !checkInterfaceAndsamples(["Video", "Empty"], dataset),
      Audio: !checkInterfaceAndsamples(["Audio", "Empty"], dataset),
      PDF: !checkInterfaceAndsamples(["PDF", "Empty"], dataset),
      Text: !checkInterfaceAndsamples(["Text", "Empty"], dataset),
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
    isReady: false,
  }
}
