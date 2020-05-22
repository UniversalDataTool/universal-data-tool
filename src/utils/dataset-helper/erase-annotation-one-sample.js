import isEmpty from "lodash/isEmpty"
export default (sample) => {
  let Newsample = sample
  if (!isEmpty(Newsample.annotation)) {
    delete Newsample["annotation"]
  }
  return Newsample
}
