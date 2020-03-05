// @flow
import React, { useState, useMemo, useEffect } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import useLocalStorage from "../../utils/use-local-storage.js"
import useFileHandler from "../../utils/file-handlers"

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
  const { file, changeFile, openFile } = useFileHandler("local-storage")
  const [errors, addError] = useErrors()
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  if (!recentItems) recentItems = []

  const onCreateTemplate = useMemo(
    () => template => {
      changeFile({
        fileName: "unnamed",
        content: template.oha,
        id: Math.random()
          .toString()
          .split(".")[1]
      })
      changePageName("edit")
    },
    []
  )

  const openRecentItem = useMemo(() => item => {
    changeFile(item)
    changePageName("edit")
  })

  const onClickHome = useMemo(
    () => () => {
      changePageName("welcome")
    },
    []
  )

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
          onOpenRecentItem: openRecentItem
        }}
      >
        {pageName === "welcome" ? (
          <StartingPage
            onFileDrop={openFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
          />
        ) : pageName === "edit" && file ? (
          <OHAEditor
            key={file.id}
            {...file}
            oha={file.content}
            onChangeFileName={newName => {
              changeFile({ ...file, fileName: newName })
            }}
            onChangeOHA={newOHA => {
              const newFile = { ...file, content: newOHA }
              changeFile(newFile)
            }}
          />
        ) : (
          <div className={c.empty}>Unknown Page "{pageName}"</div>
        )}
      </HeaderContext.Provider>
      <ErrorToasts errors={errors} />
    </>
  )
}
