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
<<<<<<< HEAD
      Image: !checkInterfaceAndsamples(["Image", "Empty"], dataset),
      Video: !checkInterfaceAndsamples(["Video", "Empty"], dataset),
      Audio: !checkInterfaceAndsamples(["Audio", "Empty"], dataset),
      PDF: !checkInterfaceAndsamples(["PDF", "Empty"], dataset),
      Text: !checkInterfaceAndsamples(["Text", "Empty"], dataset),
=======
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
>>>>>>> 0130358 (Texte to Text)
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
    isReady: false,
  }
}
