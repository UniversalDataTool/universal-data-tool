// @flow
// import { createContext, useContext } from "react"
//
// export const FileHandlerContext = createContext()
//
// export default () => useContext(FileHandlerContext)

import { useState, useMemo, useCallback } from "react"
import useServer, {
  getLatestState,
  convertToCollaborativeFile
} from "./use-server"
import useFilesystem from "./use-filesystem"
import useLocalStorage from "./use-local-storage"
import moment from "moment"

export default (mode: "local-storage" | "filesystem" | "server") => {
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
      const state = await getLatestState(sessionId)
      if (!state) return
      changeFile({
        url,
        sessionId,
        mode: "server",
        id: sessionId,
        content: state,
        lastSync: moment.utc()
      })
    },
    [changeFile]
  )

  const makeCollaborative = useCallback(async () => {
    changeFile(await convertToCollaborativeFile(file))
  }, [changeFile])

  return useMemo(
    () => ({ file, changeFile, openFile, openUrl, makeCollaborative }),
    [file, changeFile, openFile, makeCollaborative]
  )
}
