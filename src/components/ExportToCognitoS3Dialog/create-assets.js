import fetchAFile from "./fetch-a-file"
const createAssets = async (dataset, configExport, dm) => {
  await Promise.all(
    dataset.samples.map(async (sample) => {
      var sampleName = await dm.getSampleName(sample)
      var blob = await fetchAFile(sample, configExport, dm)
      if (!blob) return
      await dm.addAsset(sampleName, blob, dataset.name)
    })
  )
}
export default createAssets
