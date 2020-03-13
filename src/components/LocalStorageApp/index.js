// @flow
import React, { useState, useMemo, useEffect, useCallback } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import useLocalStorage from "../../utils/use-local-storage.js"
import useFileHandler from "../../utils/file-handlers"
import download from "in-browser-download"
import toUDTCSV from "../../utils/to-udt-csv.js"
import { setIn } from "seamless-immutable"

const useStyles = makeStyles({
  empty: {
    textAlign: "center",
    padding: 100,
    color: "#666",
    fontSize: 28
  }
})

export default () => {
  const c = useStyles()
  const { file, changeFile, openFile, openUrl, makeSession } = useFileHandler()
  const [errors, addError] = useErrors()
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  if (!recentItems) recentItems = []

  const randomId = () =>
    Math.random()
      .toString()
      .split(".")[1]

  const onCreateTemplate = useCallback(template => {
    changeFile({
      fileName: "unnamed",
      content: template.oha,
      id: randomId(),
      mode: "local-storage"
    })
  }, [])

  const openRecentItem = useCallback(item => {
    changeFile(item)
  }, [])

  const onClickHome = useMemo(() => {
    changeFile(null)
  }, [])

  const onDownload = useCallback(
    format => {
      const outputName = (file.sessionId || file.fileName) + ".udt." + format
      if (format === "json") {
        download(JSON.stringify(file.content), outputName)
      } else if (format === "csv") {
        download(toUDTCSV(file.content), outputName)
      }
    },
    [file]
  )

  // TODO REMOVE
  useEffect(() => {
    if (!file || !file.content) return
    if (file.content && !file.content.asMutable) {
      console.error("YOU'RE NOT USING AN IMMUTABLE OBJECT, WHAT HAVE YOU DONE!!!")
    }
  }, [ file && file.content ])

  useEffect(() => {
    if (!file) return
    if (!file.fileName || file.fileName === "unnamed") return
    if (file.mode !== "local-storage") return
    if (recentItems.map(item => item.id).includes(file.id)) {
      changeRecentItems(recentItems.map(ri => (ri.id === file.id ? file : ri)))
    } else {
      changeRecentItems([file].concat(recentItems).slice(0, 3))
    }
  }, [file])

  const inSession = file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)

  return (
    <>
      <HeaderContext.Provider
        value={{
          title: file
            ? file.mode === "local-storage"
              ? file.fileName
              : file.url
            : "unnamed",
          recentItems,
          onClickTemplate: onCreateTemplate,
          onClickHome,
          onOpenFile: openFile,
          onOpenRecentItem: openRecentItem,
          inSession,
          sessionBoxOpen,
          changeSessionBoxOpen,
          onJoinSession: async sessionName => {
            await openUrl(sessionName)
          },
          onLeaveSession: () =>
            changeFile({
              ...file,
              mode: "local-storage",
              id: randomId(),
              fileName: "unnamed"
            }),
          onCreateSession: makeSession,
          fileOpen: Boolean(file),
          onDownload
        }}
      >
        {!file ? (
          <StartingPage
            onFileDrop={openFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
            onClickOpenSession={() => changeSessionBoxOpen(true)}
          />
        ) : (
          <OHAEditor
            key={file.id}
            {...file}
            inSession={inSession}
            oha={file.content}
            onChangeFileName={newName => {
              changeFile(setIn(file, ["fileName"], newName))
            }}
            onChangeOHA={newOHA => {
              changeFile(setIn(file, ["content"], newOHA))
            }}
          />
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
