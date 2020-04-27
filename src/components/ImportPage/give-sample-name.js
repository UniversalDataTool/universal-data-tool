export default (appendedTaskData, oha) => {
  function getSampleNameFromURL(sample) {
    var sampleName
    if (typeof sample.imageUrl !== "undefined") {
      sampleName = sample.imageUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    } else {
      sampleName = sample.videoUrl.match(
        `.*\\/(([^\\/\\\\&\\?]*)\\.([a-zA-Z0-9]*))(\\?|$)`
      )
    }
    return sampleName
  }
  function searchSampleName(sampleName, myArray) {
    var nameToSearch
    for (var i = 0; i < myArray.length; i++) {
      nameToSearch = getSampleNameFromURL(myArray[i])
      if (typeof myArray[i].sampleName !== "undefined") {
        nameToSearch[1] = myArray[i].sampleName
      }
      if (
        nameToSearch[0] !== sampleName[0] &&
        nameToSearch[1] === sampleName[1]
      ) {
        return true
      }
    }
    return false
  }
  for (var i = 0; i < appendedTaskData.length; i++) {
    var sampleName = getSampleNameFromURL(appendedTaskData[i])
    var boolName = true
    var v = 1
    while (boolName) {
      if (
        searchSampleName(sampleName, oha.taskData) ||
        searchSampleName(sampleName, appendedTaskData)
      ) {
        sampleName[1] = sampleName[2] + v.toString() + "." + sampleName[3]
        v++
      } else {
        appendedTaskData[i].sampleName = sampleName[1]
        boolName = false
      }
    }
    appendedTaskData[i].sampleName = sampleName[1]
  }
  console.log(appendedTaskData)
  return appendedTaskData
}
