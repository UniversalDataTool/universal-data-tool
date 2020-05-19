import { setIn } from "seamless-immutable"
import * as datasetHelper from "../../utils//dataset-helper"
import isEmpty from "lodash/isEmpty"
export default (file, json, configImport) => {
  var contentOldFile = file.content
  contentOldFile = setIn(
    contentOldFile,
    ["samples"],
    datasetHelper.concatSample(
      file.content.samples,
      json.content.samples,
      configImport.annotationToKeep
    )
  )

  contentOldFile = setIn(contentOldFile, ["interface"], json.content.interface)
  file = setIn(file, ["content"], contentOldFile)
  if (isEmpty(file.fileName) || file.fileName === "unnamed")
    file = setIn(file, ["fileName"], json.fileName)
  return file
}
