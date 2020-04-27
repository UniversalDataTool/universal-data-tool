// @flow

import { useState, useMemo, useEffect } from "react"
import useServer, {
  joinSession,
  convertToCollaborativeFile,
} from "./use-server"
import useFilesystem from "./use-filesystem"
import useLocalStorage from "./use-local-storage"
import { useToasts } from "../../components/Toasts"
import fromUDTCSV from "../from-udt-csv.js"
import useEventCallback from "use-event-callback"
import useFileTelemetry from "./use-file-telemetry"

export default () => {
  const [file, changeFile] = useState()
  const { addToast } = useToasts()

  const { saveFile } = useFilesystem(file, changeFile)
  const { recentItems, changeRecentItems } = useLocalStorage(file, changeFile)
  useServer(file, changeFile)

  // Telemetry
  useFileTelemetry(file && file.content)

  const openFile = useEventCallback((fsFile) => {
    const { name: fileName, path: filePath } = fsFile

    function handleLoadedFile(content) {
      try {
        let oha
        if (fileName.endsWith("csv")) {
          oha = fromUDTCSV(content)
        } else {
          oha = JSON.parse(content)
        }
        // TODO validate OHA and prompt to open anyway if invalid
        changeFile({
          fileName,
          filePath,
          mode: filePath ? "filesystem" : "local-storage",
          content: oha,
          id: filePath,
        })
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
  })

  const openUrl = useEventCallback(async (url) => {
    const sessionId = decodeURIComponent(url.match(/[?&]s=([^&]+)/)[1])
    if (!sessionId) return
    const { state } = await joinSession(sessionId)
    if (!state) return
    window.history.replaceState(
      {},
      window.document.title,
      `/?s=${encodeURIComponent(sessionId)}`
    )
    changeFile({
      url,
      sessionId,
      mode: "server",
      id: sessionId,
      content: state,
    })
  })

  useEffect(() => {
    if (!file) return
    if (file.mode === "server") return
    window.history.replaceState({}, window.document.title, `/`)
  }, [file])

  useEffect(() => {
    if (window.location.search.match(/[?&]s=([a-zA-Z0-9]+)/)) {
      openUrl(window.location.href)
    }
  }, [openUrl])

  const makeSession = useEventCallback(async () => {
    const newFile = await convertToCollaborativeFile(file)
    changeFile(newFile)
    window.history.replaceState(
      {},
      window.document.title,
      `/?s=${encodeURIComponent(newFile.sessionId)}`
    )
  })

  return useMemo(
    () => ({
      file,
      changeFile,
      openFile,
      openUrl,
      makeSession,
      saveFile,
      recentItems,
      changeRecentItems,
    }),
    [file, changeFile, openFile, saveFile, makeSession, recentItems,changeRecentItems, openUrl]
  )
}
