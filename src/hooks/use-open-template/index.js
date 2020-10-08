import LocalStorageDatasetManager from "../use-active-dataset-manager/LocalStorageDatasetManager.js"

import useActiveDatasetManager from "../use-active-dataset-manager"
import useEventCallback from "use-event-callback"

export default () => {
  const [, setActiveDatasetManager] = useActiveDatasetManager()
  return useEventCallback((template) => {
    const dm = new LocalStorageDatasetManager()
    dm.setDataset(template.dataset)
    setActiveDatasetManager(dm)
  })
}
