import { useEffect } from "react"
import useElectron from "../use-electron"
import useActiveDatasetManager from "../use-active-dataset-manager"
import LocalStorageDatasetManager from "udt-dataset-managers/dist/LocalStorageDatasetManager"
import templates from "../../components/StartingPage/templates"
import useToasts from "../use-toasts"
import toUDTCSV from "../../utils/to-udt-csv.js"
import useOpenFile from "../use-open-file"

export default () => {
  const electron = useElectron()
  const { addToast } = useToasts()
  const openFile = useOpenFile()
  const [dm, setDatasetManager] = useActiveDatasetManager()

  useEffect(() => {
    if (!electron) return

    const { ipcRenderer, remote } = electron

    const onOpenWelcomePage = () => {
      setDatasetManager(null)
    }

    const onNewFile = async (arg0, { templateName } = {}) => {
      const newDM = new LocalStorageDatasetManager()
      await newDM.setDataset(
        templates.find((t) => t.name === templateName) || templates[0]
      )
      setDatasetManager(newDM)
    }

    async function setFilePath() {
      const {
        cancelled,
        filePath: newFilePath,
      } = await remote.dialog.showSaveDialog({
        filters: [
          { name: ".udt.json", extensions: ["udt.json"] },
          { name: ".udt.csv", extensions: ["udt.csv"] },
        ],
      })

      let filePath =
        !newFilePath ||
        newFilePath.endsWith(".json") ||
        newFilePath.endsWith(".csv")
          ? newFilePath
          : `${newFilePath}.udt.json`
      if (cancelled || !filePath) {
        addToast("Could not save")
        return
      }
      await dm.setDatasetProperty("filePath", filePath)
      return filePath
    }

    async function saveFileAsync({ saveAs = false } = {}) {
      if (!dm) return
      let filePath = await dm.getDatasetProperty("filePath")
      if (!filePath || saveAs) {
        filePath = await setFilePath()
      }
      const ds = await dm.getDataset()
      await remote
        .require("fs")
        .promises.writeFile(
          filePath,
          filePath.endsWith(".csv")
            ? toUDTCSV(ds)
            : JSON.stringify(ds, null, "  ")
        )
      addToast("File Saved!")
    }

    const exportToCSV = async () => {
      if (!dm) return
      let { cancelled, filePath } = await remote.dialog.showSaveDialog({
        filters: [{ name: ".udt.csv", extensions: ["udt.csv"] }],
      })
      if (cancelled) return
      const ds = await dm.getDataset()
      filePath =
        !filePath || filePath.endsWith(".csv")
          ? filePath
          : `${filePath}.udt.csv`

      await remote.require("fs").promises.writeFile(filePath, toUDTCSV(ds))
    }

    const onOpenFileFromToolbar = (e, file) => {
      openFile(file)
    }

    const onSaveFile = () => saveFileAsync()
    const onSaveFileAs = () => saveFileAsync({ saveAs: true })

    ipcRenderer.on("open-welcome-page", onOpenWelcomePage)
    ipcRenderer.on("new-file", onNewFile)
    ipcRenderer.on("open-file", onOpenFileFromToolbar)
    ipcRenderer.on("save-file", onSaveFile)
    ipcRenderer.on("save-file-as", onSaveFileAs)
    ipcRenderer.on("export-to-csv", exportToCSV)
    return () => {
      ipcRenderer.removeListener("open-welcome-page", onOpenWelcomePage)
      ipcRenderer.removeListener("new-file", onNewFile)
      ipcRenderer.removeListener("open-file", onOpenFileFromToolbar)
      ipcRenderer.removeListener("save-file", onSaveFile)
      ipcRenderer.removeListener("save-file-as", onSaveFileAs)
      ipcRenderer.removeListener("export-to-csv", exportToCSV)
    }
  }, [electron, dm, setDatasetManager, addToast, openFile])
}
