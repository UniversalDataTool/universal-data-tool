const getSources = (annotations) => {
  return annotations
    .map((obj) => obj.source)
    .filter((source, index, self) => self.indexOf(source) === index)
}
export default getSources
