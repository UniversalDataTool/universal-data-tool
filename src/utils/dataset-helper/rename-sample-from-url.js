import getSampleWithName from "./get-sample-with-name"
import getSampleUrl from "./get-sample-url"
import isEmpty from "lodash/isEmpty"
import { setIn } from "seamless-immutable"
export default (dataset, sampleToChange, sampleName) => {
  var boolName = true
  var v = 1
  while (boolName) {
    var sampletocompare1 = getSampleWithName(dataset, sampleName[1])
    if (
      sampletocompare1 !== null &&
      getSampleUrl(sampletocompare1) !== getSampleUrl(sampleToChange)
    ) {
      if (isEmpty(sampleName[2].match("(.*)\\([0-9]*\\)$"))) {
        sampleName = setIn(
          sampleName,
          [1],
          sampleName[2] + "(" + v.toString() + ")." + sampleName[3]
        )
      } else {
        sampleName[1] =
          sampleName[2].match("(.*)\\([0-9]*\\)$")[1] +
          "(" +
          v.toString() +
          ")" +
          +"." +
          sampleName[3]
      }
      v++
    } else {
      boolName = false
    }
  }
  return sampleName
}
