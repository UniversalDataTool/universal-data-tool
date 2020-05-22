import { useEffect, useRef, useState } from "react"
import getTextfromSample from "../dataset-helper/get-text-from-sample"
export default (props, currentSampleIndex) => {
  const [textToShow, changeTextToShow] = useState("")
  useEffect(() => {
    getTextfromSample(props.samples[currentSampleIndex]).then((result) => {
      if (result !== textToShow) changeTextToShow(result)
    })
  }, [props.samples, currentSampleIndex, textToShow])
  return { textToShow, changeTextToShow }
}
