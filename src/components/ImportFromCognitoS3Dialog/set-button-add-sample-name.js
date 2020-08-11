import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import isEmpty from "lodash/isEmpty"
export default (loadProjectIsSelected, typeOfFileToLoad, dataForTable) => {
  var numberOfSamples = 0
  var textToSet = ""
  var folderName
  if (!isEmpty(dataForTable)) {
    for (var i = 0; i < dataForTable.length; i++) {
      if (dataForTable[i].isSelected) {
        folderName = dataForTable[i].folder
        if (!isEmpty(dataForTable[i].rowData)) {
          for (var y = 0; y < dataForTable[i].rowData.length; y++) {
            if (
              RecognizeFileExtension(dataForTable[i].rowData[y].data) ===
              typeOfFileToLoad
            ) {
              numberOfSamples++
            }
          }
        }
      }
    }
    if (loadProjectIsSelected) {
      textToSet = "Load " + folderName
    } else {
      textToSet = "Add " + numberOfSamples + " " + typeOfFileToLoad
    }
  }
  return textToSet
}
