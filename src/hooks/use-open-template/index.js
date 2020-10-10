import LocalStorageDatasetManager from "udt-dataset-managers/dist/LocalStorageDatasetManager"

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
