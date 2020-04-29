import getSampleNameFromURL from "../../utils/get-sample-name-from-url"
import isEmpty from "../../utils/isEmpty"
export default (appendedTaskData, oha) => {
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
        console.log(sampleName[2])
        if(isEmpty(sampleName[2].match('(.*)\\([0-9]*\\)$'))){
          sampleName[1] = sampleName[2] +"(" +v.toString()+")." + sampleName[3]
        }else{
          sampleName[1] = sampleName[2].match('(.*)\\([0-9]*\\)$')[1] +"(" +v.toString()+")"+ + "." + sampleName[3] 
        }
        v++
      } else {
        appendedTaskData[i].sampleName = sampleName[1]
        boolName = false
      }
    }
    appendedTaskData[i].sampleName = sampleName[1]
  }
  return appendedTaskData
}
