import useActiveDatasetManager from "../use-active-dataset-manager"
import useEventCallback from "use-event-callback"
import fromUDTCSV from "../../utils/from-udt-csv"
import LocalStorageDatasetManager from "udt-dataset-managers/dist/LocalStorageDatasetManager"
import { useToasts } from "../../components/Toasts"

export default () => {
  const [, setActiveDatasetManager] = useActiveDatasetManager()
  const { addToast } = useToasts()

  return useEventCallback((fsFile) => {
    const { name: fileName, path: filePath } = fsFile

    async function handleLoadedFile(content) {
      try {
        let dataset
        if (fileName.endsWith("csv")) {
          dataset = fromUDTCSV(content)
        } else {
          dataset = JSON.parse(content)
        }
        // TODO validate OHA and prompt to open anyway if invalid
        const dm = new LocalStorageDatasetManager()
        await dm.setDataset({ ...dataset, filePath, name: fileName })
        setActiveDatasetManager(dm)
      } catch (e) {
        console.log(e.toString())
        addToast("Couldn't read file, see console for details", "error")
        // addError(`Could not read file "${fsFile.name}"`)
      }
    }

    if (fsFile.content) {
      handleLoadedFile(fsFile.content)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        handleLoadedFile(content)
      }
      reader.readAsText(fsFile)
    }
    setActiveDatasetManager()
  })
}
