// @flow

import { useEffect } from "react"
import useEventCallback from "use-event-callback"
import useElectron from "../../hooks/use-electron.js"
import { useToasts } from "../../components/Toasts"
import { setIn } from "seamless-immutable"
import toUDTCSV from "../to-udt-csv.js"
import useIsDesktop from "../../hooks/use-is-desktop"

const webReturn = { saveFile: () => null }

export default (file, changeFile) => {
  const isDesktop = useIsDesktop()
  if (!isDesktop) return webReturn
  const { addToast } = useToasts()
  const { remote } = useElectron()
  const saveFile = useEventCallback(({ saveAs = false } = {}) => {
    if (!file) return
    async function saveFileAsync() {
      let filePath = file.filePath
      if (!file.filePath || saveAs) {
        const {
          cancelled,
          filePath: newFilePath,
        } = await remote.dialog.showSaveDialog({
          filters: [
            { name: ".udt.json", extensions: ["udt.json"] },
            { name: ".udt.csv", extensions: ["udt.csv"] },
          ],
        })
        filePath =
          !newFilePath ||
          newFilePath.endsWith(".json") ||
          newFilePath.endsWith(".csv")
            ? newFilePath
            : `${newFilePath}.udt.json`
        if (cancelled || !filePath) {
          addToast("Could not save")
          return
        }
        changeFile({
          ...file,
          filePath,
          fileName: filePath.split("/").slice(-1)[0],
        })
      }
      await remote
        .require("fs")
        .promises.writeFile(
          filePath,
          filePath.endsWith(".csv")
            ? toUDTCSV(file.content)
            : JSON.stringify(file.content, null, "  ")
        )
      addToast("File Saved!")
    }
    saveFileAsync()
  })

  useEffect(() => {
    if (!file || !file.filePath) return
    if (file.fileName !== file.filePath.split("/").slice(-1)[0]) {
      changeFile(
        setIn(
          file,
          ["filePath"],
          file.filePath
            .split("/")
            .slice(0, -1)
            .concat([
              file.fileName +
                (file.fileName.endsWith(".json") ? "" : ".dataset.json"),
            ])
            .join("/")
        )
      )
    }
  }, [file, changeFile])

  return { saveFile }
}
