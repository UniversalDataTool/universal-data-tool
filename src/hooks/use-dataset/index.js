import { useEffect, useState } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

/*

** IMPORTANT : Try not to use! **

Datasets can be reallllly big and trying to load them into memory can cause
problems. Try to use useInterface, useSample, useDatasetProperty or
useActiveDatasetManager.

*/

export default () => {
  const [dataset, setDataset] = useState({})
  const [dm] = useActiveDatasetManager()

  useEffect(() => {
    if (!dm) return
    async function loadDataset() {
      setDataset(await dm.getDataset())
    }
    dm.on("dataset-reloaded", loadDataset)
    loadDataset()
    return () => {
      dm.off("dataset-reloaded", loadDataset)
    }
  }, [dm])

  return [dataset, dm.setDataset]
}
