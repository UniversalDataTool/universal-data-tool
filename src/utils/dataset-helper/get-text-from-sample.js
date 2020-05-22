import isEmpty from "lodash/isEmpty"
import getTextFromUrl from "./get-text-from-url"
export default async (sample) => {
  var text = ""
  if (isEmpty(sample.document)) {
    if (!isEmpty(sample.textUrl)) {
      text = await getTextFromUrl(sample.textUrl)
    }
  } else {
    text = sample.document
  }
  return text
}
