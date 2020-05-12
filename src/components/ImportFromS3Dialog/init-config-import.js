import checkInterfaceAndsamples from "./check-interface-and-sample-type"
export default (file) => {
  return {
    annotationToKeep: "both",
    typeOfFileToLoad: checkInterfaceAndsamples(["Image", "Empty"], file)
      ? "Image"
      : checkInterfaceAndsamples(["Video", "Empty"], file)
      ? "Video"
      : checkInterfaceAndsamples(["Audio", "Empty"], file)
      ? "Audio"
      : checkInterfaceAndsamples(["PDF", "Empty"], file)
      ? "PDF"
      : "None",
    typeOfFileToDisable: {
      Image: checkInterfaceAndsamples(["Image", "Empty"], file) ? false : true,
      Video: checkInterfaceAndsamples(["Video", "Empty"], file) ? false : true,
      Audio: checkInterfaceAndsamples(["Audio", "Empty"], file) ? false : true,
      PDF: checkInterfaceAndsamples(["PDF", "Empty"], file) ? false : true,
    },
    loadProjectIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
  }
}
