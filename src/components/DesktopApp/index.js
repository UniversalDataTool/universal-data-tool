// @flow
import React, { useState, useMemo, useEffect } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import Toasts, { useToasts } from "../Toasts"
import useErrors from "../../utils/use-errors.js"
import useLocalStorage from "../../utils/use-local-storage.js"
import useElectron from "../../utils/use-electron.js"
import templates from "../StartingPage/templates"

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
  const [pageName, changePageName] = useState("welcome")
  const [currentFile, changeCurrentFile] = useState()
  const [oha, changeOHA] = useState()
  const [errors, addError] = useErrors()
  let [recentItems, changeRecentItems] = [[], () => null] // useLocalStorage("recentItems", [])
  const { addToast } = useToasts()
  if (!recentItems) recentItems = []
  const { remote, ipcRenderer } = useElectron()

  const onCreateTemplate = useMemo(
    () => template => {
      changeCurrentFile({
        fileName: "unnamed",
        content: template.oha,
        id: Math.random()
          .toString()
          .split(".")[1]
      })
      changeOHA(template.oha)
      changePageName("edit")
    },
    []
  )

  useEffect(() => {
    const onOpenWelcomePage = () => changePageName("welcome")
    const onOpenSettingsPage = () => changePageName("edit")
    const onOpenSamplesPage = () => changePageName("edit")
    const onOpenLabelPage = () => changePageName("edit")
    const onNewFile = (e, data) => {
      if (data.templateName) {
        onCreateTemplate(
          templates.find(template => template.name === data.templateName)
        )
      } else {
        changeCurrentFile({
          fileName: "unnamed",
          content: {},
          id: Math.random()
            .toString()
            .split(".")[1]
        })
        changeOHA({})
        changePageName("edit")
      }
    }
    const onOpenFile = (e, data) => {
      try {
        const oha = JSON.parse(data.content)
        changeCurrentFile({
          ...data,
          content: oha
        })
        changeOHA(oha)
        changePageName("edit")
      } catch (e) {
        addError(e.toString())
      }
    }
    const onSaveFile = async (e, data) => {
      let filePath = currentFile.filePath
      if (!currentFile.filePath) {
        const {
          cancelled,
          filePath: newFilePath
        } = await remote.dialog.showSaveDialog()
        filePath = newFilePath
        if (cancelled || !filePath) {
          addError("Could not save")
          return
        }
        changeCurrentFile({ ...currentFile, filePath })
      }
      await remote
        .require("fs")
        .promises.writeFile(filePath, JSON.stringify(oha, null, "  "))
      addToast("File Saved!")
    }
    ipcRenderer.on("open-welcome-page", onOpenWelcomePage)
    ipcRenderer.on("open-settings-page", onOpenSettingsPage)
    ipcRenderer.on("open-samples-page", onOpenSamplesPage)
    ipcRenderer.on("open-label-page", onOpenLabelPage)
    ipcRenderer.on("new-file", onNewFile)
    ipcRenderer.on("open-file", onOpenFile)
    ipcRenderer.on("save-file", onSaveFile)
    return () => {
      ipcRenderer.removeListener("open-welcome-page", onOpenWelcomePage)
      ipcRenderer.removeListener("open-settings-page", onOpenWelcomePage)
      ipcRenderer.removeListener("open-samples-page", onOpenWelcomePage)
      ipcRenderer.removeListener("open-label-page", onOpenWelcomePage)
      ipcRenderer.removeListener("new-file", onNewFile)
      ipcRenderer.removeListener("open-file", onOpenFile)
      ipcRenderer.removeListener("save-file", onSaveFile)
    }
  }, [currentFile])

  const openRecentItem = useMemo(() => item => {
    changeCurrentFile(item)
    try {
      changeOHA(JSON.parse(item.content))
    } catch (e) {
      addError("Couldn't parse content into JSON")
    }
    changePageName("edit")
  })

  const onClickHome = useMemo(() => () => changePageName("welcome"), [])

  const handleOpenFile = useMemo(
    () => file => {
      const { name: fileName, path: filePath } = file
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target.result
        try {
          const oha = JSON.parse(content)
          // TODO validate OHA and prompt to open anyway if invalid
          changeCurrentFile({
            fileName,
            filePath,
            content: oha,
            id: filePath
          })
          changeOHA(oha)
          changePageName("edit")
        } catch (e) {
          console.log(e.toString())
          addError(`Could not read file "${file.name}"`)
        }
      }
      reader.readAsText(file)
    },
    []
  )

  return (
    <>
      <HeaderContext.Provider
        value={{
          recentItems,
          onClickTemplate: onCreateTemplate,
          onClickHome,
          onOpenRecentItem: openRecentItem,
          isDesktop: true
        }}
      >
        {pageName === "welcome" ? (
          <StartingPage
            showDownloadLink={false}
            onFileDrop={handleOpenFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
          />
        ) : pageName === "edit" && currentFile ? (
          <OHAEditor
            key={currentFile.id}
            {...currentFile}
            oha={oha}
            onChangeFileName={newName => {
              changeCurrentFile({ ...currentFile, fileName: newName })
            }}
            onChangeContent={newContent => {
              const newFile = { ...currentFile, content: newContent }
              changeCurrentFile(newFile)
              if (recentItems.map(item => item.id).includes(newFile.id)) {
                changeRecentItems(
                  recentItems.map(ri => (ri.id === newFile.id ? newFile : ri))
                )
              } else {
                changeRecentItems([newFile].concat(recentItems).slice(0, 3))
              }
            }}
            onChangeOHA={changeOHA}
          />
        ) : (
          <div className={c.empty}>Unknown Page "{pageName}"</div>
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
      <Toasts />
    </>
  )
}
