// @flow
import React, { useState, useMemo, useEffect } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"
import useLocalStorage from "../../utils/use-local-storage.js"

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
  const [errors, addError] = useErrors()
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  if (!recentItems) recentItems = []

  const onCreateTemplate = useMemo(
    () => template => {
      changeCurrentFile({
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
    changeCurrentFile(item)
    changePageName("edit")
  })

  const onClickHome = useMemo(
    () => () => {
      changePageName("welcome")
    },
    []
  )

  const handleOpenFile = useMemo(
    () => file => {
      const fileName = file.name
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target.result
        try {
          const oha = JSON.parse(content)
          // TODO validate OHA and prompt to open anyway if invalid
          changeCurrentFile({
            fileName,
            content: oha,
            id: Math.random()
              .toString()
              .split(".")[1]
          })
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

  useEffect(() => {
    if (!currentFile) return
    if (!currentFile.fileName || currentFile.fileName === "unnamed") return
    if (recentItems.map(item => item.id).includes(currentFile.id)) {
      changeRecentItems(
        recentItems.map(ri => (ri.id === currentFile.id ? currentFile : ri))
      )
    } else {
      changeRecentItems([currentFile].concat(recentItems).slice(0, 3))
    }
  }, [currentFile])

  return (
    <>
      <HeaderContext.Provider
        value={{
          title: currentFile ? currentFile.fileName : "unnamed",
          recentItems,
          onClickTemplate: onCreateTemplate,
          onClickHome,
          onOpenFile: handleOpenFile,
          onOpenRecentItem: openRecentItem
        }}
      >
        {pageName === "welcome" ? (
          <StartingPage
            onFileDrop={handleOpenFile}
            onOpenTemplate={onCreateTemplate}
            recentItems={recentItems}
            onOpenRecentItem={openRecentItem}
          />
        ) : pageName === "edit" && currentFile ? (
          <OHAEditor
            key={currentFile.id}
            {...currentFile}
            oha={currentFile.content}
            onChangeFileName={newName => {
              changeCurrentFile({ ...currentFile, fileName: newName })
            }}
            onChangeOHA={newOHA => {
              const newFile = { ...currentFile, content: newOHA }
              changeCurrentFile(newFile)
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
