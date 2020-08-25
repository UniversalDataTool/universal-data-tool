// @flow
import React, { useState, useCallback } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import DatasetEditor from "../DatasetEditor"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import useFileHandler from "../../utils/file-handlers"
import download from "in-browser-download"
import toUDTCSV from "../../utils/to-udt-csv.js"
import { setIn } from "seamless-immutable"
import AppErrorBoundary from "../AppErrorBoundary"
import useEventCallback from "use-event-callback"
import usePreventNavigation from "../../utils/use-prevent-navigation"
import { FileContext } from "../FileContext"
import usePosthog from "../../utils/use-posthog"
const randomId = () => Math.random().toString().split(".")[1]

export default () => {
  const {
    file,
    setFile,
    openFile,
    openUrl,
    makeSession,
    recentItems,
    changeRecentItems,
  } = useFileHandler()
  usePreventNavigation(Boolean(file))
  const posthog = usePosthog()
  const [errors] = useErrors()

  const [selectedBrush, setSelectedBrush] = useState("complete")
  const onCreateTemplate = useEventCallback((template) => {
    setFile({
      fileName: "unnamed",
      content: template.dataset,
      id: randomId(),
      mode: "local-storage",
    })
  })

  const openRecentItem = useEventCallback((item) => setFile(item))
  const onClickHome = useEventCallback(() => setFile(null))
  const onDownload = useEventCallback((format) => {
    if (!file) return
    posthog.capture("download_file", { file_type: format })
    const outputName = (file.sessionId || file.fileName) + ".udt." + format
    if (format === "json") {
      download(JSON.stringify(file.content), outputName)
    } else if (format === "csv") {
      download(toUDTCSV(file.content), outputName)
    }
  })

  const inSession = file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)

  const onJoinSession = useCallback(
    async (sessionName) => {
      await openUrl(sessionName)
    },
    [openUrl]
  )

  const onLeaveSession = useEventCallback(() =>
    setFile({
      ...file,
      mode: "local-storage",
      fileName: file.fileName || `copy_of_${file.id}`,
    })
  )

  const onChangeDataset = useEventCallback((newDataset) => {
    setFile(setIn(file, ["content"], newDataset))
  })

  return (
    <>
      <FileContext.Provider value={{ file, setFile }}>
        <HeaderContext.Provider
          value={{
            title: file
              ? file.mode === "local-storage"
                ? file.fileName
                : file.url
              : "unnamed",
            interfaceType: file?.content?.interface?.type,
            recentItems,
            changeRecentItems,
            onClickTemplate: onCreateTemplate,
            onClickHome,
            onOpenFile: openFile,
            onOpenRecentItem: openRecentItem,
            inSession,
            sessionBoxOpen,
            changeSessionBoxOpen,
            onJoinSession,
            onLeaveSession,
            onCreateSession: makeSession,
            fileOpen: Boolean(file),
            onDownload,
            onChangeSelectedBrush: setSelectedBrush,
            selectedBrush,
            isWelcomePage: !file,
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
            <AppErrorBoundary>
              <DatasetEditor
                file={file}
                key={file.id}
                {...file}
                selectedBrush={selectedBrush}
                inSession={inSession}
                dataset={file.content}
                onChangeDataset={onChangeDataset}
                onChangeFile={setFile}
                authConfig
                recentItems={recentItems}
              />
            </AppErrorBoundary>
          )}
        </HeaderContext.Provider>
      </FileContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
