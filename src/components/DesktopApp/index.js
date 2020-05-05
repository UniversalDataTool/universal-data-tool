// @flow
import React, { useState, useMemo, useEffect } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import { useToasts } from "../Toasts"
import useErrors from "../../utils/use-errors.js"
import useLocalStorage from "../../utils/use-local-storage.js"
import useElectron from "../../utils/use-electron.js"
import templates from "../StartingPage/templates"
import useEventCallback from "use-event-callback"
import { setIn } from "seamless-immutable"
import toUDTCSV from "../../utils/to-udt-csv.js"

import useFileHandler from "../../utils/file-handlers"

const useStyles = makeStyles({
  empty: {
    textAlign: "center",
    padding: 100,
    color: "#666",
    fontSize: 28,
  },
})

const randomId = () => Math.random().toString().split(".")[1]

export default () => {
  const c = useStyles()
  const {
    file,
    changeFile,
    openFile,
    openUrl,
    makeSession,
    saveFile,
    recentItems,
  } = useFileHandler()

  const [selectedBrush, setSelectedBrush] = useState("complete")
  const [errors, addError] = useErrors()
  const { addToast } = useToasts()

  const { remote, ipcRenderer } = useElectron()

  const onCreateTemplate = useEventCallback((template) => {
    changeFile({
      fileName: "unnamed",
      content: template.oha,
      id: randomId(),
      mode: "filesystem",
    })
  })

  const openRecentItem = useEventCallback((item) => changeFile(item))
  const onClickHome = useEventCallback(() => changeFile(null))

  useEffect(() => {
    const onOpenWelcomePage = () => changeFile(null)
    const onNewFile = (arg0, { templateName } = {}) => {
      onCreateTemplate(
        templates.find((t) => t.name === templateName) || templates[0]
      )
    }
    const saveFileAs = () => saveFile({ saveAs: true })
    const exportToCSV = async () => {
      if (!file) return
      let { cancelled, filePath } = await remote.dialog.showSaveDialog({
        filters: [{ name: ".udt.csv", extensions: ["udt.csv"] }],
      })
      filePath =
        !filePath || filePath.endsWith(".csv")
          ? filePath
          : `${filePath}.udt.csv`

      await remote
        .require("fs")
        .promises.writeFile(filePath, toUDTCSV(file.content))
    }
    const onOpenFileFromToolbar = (e, file) => openFile(file)

    ipcRenderer.on("open-welcome-page", onOpenWelcomePage)
    ipcRenderer.on("new-file", onNewFile)
    ipcRenderer.on("open-file", onOpenFileFromToolbar)
    ipcRenderer.on("save-file", saveFile)
    ipcRenderer.on("save-file-as", saveFileAs)
    ipcRenderer.on("export-to-csv", exportToCSV)
    return () => {
      ipcRenderer.removeListener("open-welcome-page", onOpenWelcomePage)
      ipcRenderer.removeListener("new-file", onNewFile)
      ipcRenderer.removeListener("open-file", onOpenFileFromToolbar)
      ipcRenderer.removeListener("save-file", saveFile)
      ipcRenderer.removeListener("save-file-as", saveFileAs)
      ipcRenderer.removeListener("export-to-csv", exportToCSV)
    }
  }, [file])

  const inSession = file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)

  const onJoinSession = useEventCallback(async (sessionName) => {
    await openUrl(sessionName)
  })

  const onLeaveSession = useEventCallback(() =>
    changeFile({
      ...file,
      mode: "local-storage",
      fileName: file.fileName || `copy_of_${file.id}`,
    })
  )

  const collaborateError = (((file || {}).content || {}).taskData || []).some(
    (sample) =>
      [sample.imageUrl, sample.videoUrl, sample.pdfUrl]
        .filter(Boolean)
        .map((a) => a.includes("file://"))
        .some(Boolean)
  )
    ? "Some URLs (links) in this file are connected to files on your computer. Use the Samples > Transform > Transform Files to Web URLs to upload these files, then collaboration will be available."
    : null

  return (
    <>
      <HeaderContext.Provider
        value={{
          recentItems,
          onClickTemplate: onCreateTemplate,
          onClickHome,
          title: file
            ? file.mode !== "server"
              ? file.fileName
              : file.url
            : "unnamed",
          fileOpen: Boolean(file),
          onOpenRecentItem: openRecentItem,
          isDesktop: true,
          onOpenFile: openFile,
          selectedBrush,
          onChangeSelectedBrush: setSelectedBrush,

          // collaboration session
          inSession,
          sessionBoxOpen,
          changeSessionBoxOpen,
          collaborateError,
          onJoinSession,
          onLeaveSession,
          onCreateSession: makeSession,
        }}
      >
        {!file ? (
          <StartingPage
            showDownloadLink={false}
            onFileDrop={openFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
          />
        ) : (
          <OHAEditor
            key={file.id}
            {...file}
            inSession={inSession}
            selectedBrush={selectedBrush}
            oha={file.content}
            onChangeFileName={(newName) => {
              changeFile(setIn(file, ["fileName"], newName))
            }}
            onChangeOHA={(newOHA) => {
              changeFile(setIn(file, ["content"], newOHA))
            }}
          />
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
