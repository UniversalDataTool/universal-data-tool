// @flow
import React, { useState, useEffect } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import DatasetEditor from "../DatasetEditor"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../hooks/use-errors.js"
import useElectron from "../../hooks/use-electron.js"
import templates from "../StartingPage/templates"
import useEventCallback from "use-event-callback"
import { setIn } from "seamless-immutable"
import toUDTCSV from "../../utils/to-udt-csv.js"
import useFileHandler from "../../utils/file-handlers"

const randomId = () => Math.random().toString().split(".")[1]

export default () => {
  const {
    file,
    setFile,
    openFile,
    openUrl,
    makeSession,
    saveFile,
    recentItems,
  } = useFileHandler()

  const [selectedBrush, setSelectedBrush] = useState("complete")
  const [errors] = useErrors()

  const { remote, ipcRenderer } = useElectron()

  const onCreateTemplate = useEventCallback((template) => {
    setFile({
      fileName: "unnamed",
      content: template.dataset,
      id: randomId(),
      mode: "filesystem",
    })
  })

  const openRecentItem = useEventCallback((item) => setFile(item))
  const onClickHome = useEventCallback(() => setFile(null))

  useEffect(() => {
    const onOpenWelcomePage = () => setFile(null)
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
      if (cancelled) return
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
  }, [file, setFile, ipcRenderer, openFile, onCreateTemplate, remote, saveFile])

  const inSession = file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)

  const onJoinSession = useEventCallback(async (sessionName) => {
    await openUrl(sessionName)
  })

  const onLeaveSession = useEventCallback(() =>
    setFile({
      ...file,
      mode: "local-storage",
      fileName: file.fileName || `copy_of_${file.id}`,
    })
  )

  const collaborateError = (file?.content?.samples || []).some((sample) =>
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
          interfaceType: file?.content?.interface?.type,
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
          isWelcomePage: !file,
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
          <DatasetEditor
            key={file.id}
            {...file}
            inSession={inSession}
            selectedBrush={selectedBrush}
            dataset={file.content}
            onChangeFileName={(newName) => {
              setFile(setIn(file, ["fileName"], newName))
            }}
            onChangeDataset={(newOHA) => {
              setFile(setIn(file, ["content"], newOHA))
            }}
          />
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
