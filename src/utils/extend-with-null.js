export default (ar, len) => {
  ar = [...ar]
  while (ar.length < len) {
    ar.push(null)
  }
  return ar
}
