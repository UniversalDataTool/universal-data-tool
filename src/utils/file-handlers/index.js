// @flow

import { useState, useMemo, useCallback, useEffect } from "react"
import useServer, {
  getLatestState,
  convertToCollaborativeFile
} from "./use-server"
import useFilesystem from "./use-filesystem"
import useLocalStorage from "./use-local-storage"
import { useToasts } from "../../components/Toasts"
import moment from "moment"
import cloneDeep from "lodash/cloneDeep"
import fromUDTCSV from "../from-udt-csv.js"
import usePosthog from "../../utils/use-posthog"

export default () => {
  const [file, changeFile] = useState()
  const { addToast } = useToasts()
  const posthog = usePosthog()

  useFilesystem(file, changeFile)
  useLocalStorage(file, changeFile)
  useServer(file, changeFile)

  // Telemetry
  const udt = file && file.content
  useEffect(() => {
    if (!udt || !udt.interface) return
    posthog.capture("interface_type", { interface_type: udt.interface.type })
    posthog.people.set({ last_used_interface_type: udt.interface.type })
  }, [udt && udt.interface && udt.interface.type])
  useEffect(() => {
    if (!udt || !udt.taskData) return
    posthog.capture("dataset_size", {
      dataset_size: (udt.taskData || []).length
    })
  }, [udt && (udt.taskData || []).length])
  useEffect(() => {
    if (!udt || !udt.taskOutput) return
    const numCompleted = udt.taskOutput.filter(Boolean).length
    posthog.capture("sample_completion", {
      dataset_size: (udt.taskData || []).length,
      samples_completed: numCompleted,
      percent_completed: numCompleted / (udt.taskData || []).length
    })
  }, [
    udt && (udt.taskData || []).length,
    udt && udt.taskOutput && udt.taskOutput.filter(Boolean).length
  ])

  const openFile = useMemo(
    () => fsFile => {
      const { name: fileName, path: filePath } = fsFile
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target.result
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
            id: filePath
          })
        } catch (e) {
          console.log(e.toString())
          addToast("Couldn't read file, see console for details", "error")
          // addError(`Could not read file "${fsFile.name}"`)
        }
      }
      reader.readAsText(fsFile)
    },
    [changeFile]
  )

  const openUrl = useCallback(
    async url => {
      const sessionId = decodeURIComponent(url.match(/[\?&]s=([^&]+)/)[1])
      if (!sessionId) return
      const { state, version } = await getLatestState(sessionId)
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
        lastSyncedState: cloneDeep(state),
        lastSyncedVersion: version
      })
    },
    [changeFile]
  )

  useEffect(() => {
    if (!file) return
    if (file.mode === "server") return
    window.history.replaceState({}, window.document.title, `/`)
  }, [file && file.mode])

  useEffect(() => {
    if (window.location.search.match(/[\?&]s=([a-zA-Z0-9]+)/)) {
      openUrl(window.location.href)
    }
  }, [])

  const makeSession = useCallback(async () => {
    const newFile = await convertToCollaborativeFile(file)
    changeFile(newFile)
    window.history.replaceState(
      {},
      window.document.title,
      `/?s=${encodeURIComponent(newFile.sessionId)}`
    )
  }, [file, changeFile])

  return useMemo(() => ({ file, changeFile, openFile, openUrl, makeSession }), [
    file,
    changeFile,
    openFile,
    makeSession
  ])
}
