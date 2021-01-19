const getSources = async (annotations) => {
  return await annotations
    .map((obj) => obj.source)
    .filter((source, index, self) => self.indexOf(source) === index)
}
export default getSources
