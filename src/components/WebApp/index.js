// @flow
import React, { useState, useCallback } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import DatasetEditor from "../DatasetEditor"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import LocalStorageDatasetManager from "../../hooks/use-active-dataset-manager/LocalStorageDatasetManager.js"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"
import download from "in-browser-download"
import toUDTCSV from "../../utils/to-udt-csv.js"
import { setIn } from "seamless-immutable"
import AppErrorBoundary from "../AppErrorBoundary"
import useEventCallback from "use-event-callback"
import usePreventNavigation from "../../utils/use-prevent-navigation"
import { FileContext } from "../FileContext"
import usePosthog from "../../utils/use-posthog"
import ManagePluginsDialog from "../ManagePluginsDialog"
import usePluginProvider from "../PluginProvider"
const randomId = () => Math.random().toString().split(".")[1]

export default () => {
  // const {
  //   file,
  //   setFile,
  //   openFile,
  //   openUrl,
  //   makeSession,
  //   recentItems,
  //   changeRecentItems,
  // } = useFileHandler()

  const [datasetManager, setDatasetManager] = useActiveDatasetManager()

  usePreventNavigation(Boolean(datasetManager))
  usePluginProvider()
  const posthog = usePosthog()
  const [errors] = useErrors()

  const [managePluginsDialogOpen, setManagePluginsDialogOpen] = useState(false)

  const [selectedBrush, setSelectedBrush] = useState("complete")
  const onCreateTemplate = useEventCallback(async (template) => {
    const dm = new LocalStorageDatasetManager()
    await dm.loadDataset({
      ...template.dataset,
      name: `New ${template.dataset.interface.type} Dataset`,
    })
    setDatasetManager(dm)
  })

  const openRecentItem = useEventCallback((item) => {}) //setFile(item))
  const onClickHome = useEventCallback(() => {}) // setFile(null))
  const onClickManagePlugins = useEventCallback(() =>
    setManagePluginsDialogOpen(true)
  )
  const onDownload = useEventCallback((format) => {
    // if (!file) return
    // posthog.capture("download_file", { file_type: format })
    // const userProvidedFileName = (file.sessionId || file.fileName).replace(
    //   /\.udt\.(csv|json)/,
    //   ""
    // )
    // const outputName = userProvidedFileName + ".udt." + format
    // if (format === "json") {
    //   // download(JSON.stringify(file.content), outputName)
    // } else if (format === "csv") {
    //   // download(toUDTCSV(file.content), outputName)
    // }
  })

  const inSession = false // file && file.mode === "server"
  const [sessionBoxOpen, changeSessionBoxOpen] = useState(false)

  const onJoinSession = useCallback(
    async (sessionName) => {
      // await openUrl(sessionName)
    },
    [
      /* openUrl */
    ]
  )

  const onLeaveSession = useEventCallback(
    () => {}
    // setFile({
    //   ...file,
    //   mode: "local-storage",
    //   fileName: file.fileName || `copy_of_${file.id}`,
    // })
  )

  const onChangeDataset = useEventCallback((newDataset) => {
    // setFile(setIn(file, ["content"], newDataset))
  })

  const isWelcomePage = !datasetManager

  return (
    <>
      <FileContext.Provider value={{} /*{ file, setFile }*/}>
        <HeaderContext.Provider
          value={{
            // title: file
            //   ? file.mode === "local-storage"
            //     ? file.fileName
            //     : file.url
            //   : "unnamed",
            // interfaceType: file?.content?.interface?.type,
            recentItems: [],
            changeRecentItems: () => {},
            onClickTemplate: onCreateTemplate,
            onClickHome,
            onClickManagePlugins,
            // onOpenFile: openFile,
            onOpenRecentItem: openRecentItem,
            inSession,
            sessionBoxOpen,
            changeSessionBoxOpen,
            onJoinSession,
            onLeaveSession,
            // onCreateSession: makeSession,
            fileOpen: Boolean(datasetManager),
            onDownload,
            onChangeSelectedBrush: setSelectedBrush,
            selectedBrush,
            isWelcomePage,
          }}
        >
          <div>
            {isWelcomePage ? (
              <StartingPage
                // onFileDrop={openFile}
                onOpenTemplate={onCreateTemplate}
                recentItems={[]}
                onOpenRecentItem={openRecentItem}
                onClickOpenSession={() => changeSessionBoxOpen(true)}
              />
            ) : (
              <AppErrorBoundary>
                <DatasetEditor
                  // file={file}
                  // key={file.id}
                  // {...file}
                  selectedBrush={selectedBrush}
                  inSession={inSession}
                  authConfig
                  recentItems={[] /* recentItems */}
                />
              </AppErrorBoundary>
            )}
            <ManagePluginsDialog
              open={managePluginsDialogOpen}
              onClose={() => setManagePluginsDialogOpen(false)}
            />
          </div>
        </HeaderContext.Provider>
      </FileContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
