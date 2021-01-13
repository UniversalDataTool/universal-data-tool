import checkInterfaceAndsamples from "./check-interface-and-sample-type"
export default (dataset) => {
  return {
    annotationToKeep: "both",
    typeOfFileToLoad: checkInterfaceAndsamples(["Empty"], ["Empty"], dataset)
      ? "None"
      : checkInterfaceAndsamples(
          ["Image", "Empty"],
          ["Image", "Empty"],
          dataset
        )
      ? "Image"
      : checkInterfaceAndsamples(
          ["Video", "Empty"],
          ["Video", "Empty"],
          dataset
        )
      ? "Video"
      : checkInterfaceAndsamples(
          ["Audio", "Empty"],
          ["Audio", "Empty"],
          dataset
        )
      ? "Audio"
      : checkInterfaceAndsamples(["PDF", "Empty"], ["PDF", "Empty"], dataset)
      ? "PDF"
      : checkInterfaceAndsamples(["Text", "Empty"], ["Text", "Empty"], dataset)
      ? "Text"
      : checkInterfaceAndsamples(
          ["Time", "Empty"],
          ["Time", "Empty", "Audio"],
          dataset
        )
      ? "Time"
      : "None",
    typeOfFileToDisable: {
      Image: checkInterfaceAndsamples(
        ["Image", "Empty"],
        ["Image", "Empty"],
        dataset
      )
        ? false
        : true,
      Video: checkInterfaceAndsamples(
        ["Video", "Empty"],
        ["Video", "Empty"],
        dataset
      )
        ? false
        : true,
      Audio:
        checkInterfaceAndsamples(
          ["Time", "Empty"],
          ["Time", "Audio", "Empty"],
          dataset
        ) ||
        checkInterfaceAndsamples(
          ["Audio", "Empty"],
          ["Audio", "Empty"],
          dataset
        )
          ? false
          : true,
      PDF: checkInterfaceAndsamples(["PDF", "Empty"], ["PDF", "Empty"], dataset)
        ? false
        : true,
      Text: checkInterfaceAndsamples(
        ["Text", "Empty"],
        ["Text", "Empty"],
        dataset
      )
        ? false
        : true,
      Time: checkInterfaceAndsamples(
        ["Time", "Empty"],
        ["Audio", "Time", "Empty"],
        dataset
      )
        ? false
        : true,
    },
    loadAssetsIsSelected: true,
    contentDialogBoxIsSetting: false,
    projectStarted: false,
    isReady: false,
  }
}
