// @flow

import { useState, useMemo, useCallback, useEffect } from "react"
import useServer, {
  getLatestState,
  convertToCollaborativeFile
} from "./use-server"
import useFilesystem from "./use-filesystem"
import useLocalStorage from "./use-local-storage"
import moment from "moment"
import cloneDeep from "lodash/cloneDeep"

export default () => {
  const [file, changeFile] = useState()

  useFilesystem(file, changeFile)
  useLocalStorage(file, changeFile)
  useServer(file, changeFile)

  const openFile = useMemo(
    () => fsFile => {
      const { name: fileName, path: filePath } = fsFile
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target.result
        try {
          const oha = JSON.parse(content)
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
          // addError(`Could not read file "${fsFile.name}"`)
        }
      }
      reader.readAsText(fsFile)
    },
    [changeFile]
  )

  const openUrl = useCallback(
    async url => {
      const sessionId = url.match(/[\?&]s=([a-zA-Z0-9]+)/)[1]
      if (!sessionId) return
      const { state, version } = await getLatestState(sessionId)
      if (!state) return
      window.history.replaceState({}, window.document.title, `/?s=${sessionId}`)
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
      `/?s=${newFile.sessionId}`
    )
  }, [file, changeFile])

  return useMemo(() => ({ file, changeFile, openFile, openUrl, makeSession }), [
    file,
    changeFile,
    openFile,
    makeSession
  ])
}
