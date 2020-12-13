import useActiveDatasetManager from "../use-active-dataset-manager"

export default (datasetPropertyKey: string) => {
  const [dm] = useActiveDatasetManager()
  return dm?.removeSamples
}
