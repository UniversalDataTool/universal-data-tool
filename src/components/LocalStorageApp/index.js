// @flow
import React, { useState, useMemo } from "react"
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
  const [oha, changeOHA] = useState()
  const [errors, addError] = useErrors()
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  if (!recentItems) recentItems = []

  const onCreateTemplate = useMemo(
    () => template => {
      changeCurrentFile({
        fileName: "unnamed",
        content: JSON.stringify(template.oha, null, "  "),
        id: Math.random()
          .toString()
          .split(".")[1]
      })
      changeOHA(template.oha)
      changePageName("edit")
    },
    []
  )

  const openRecentItem = useMemo(() => item => {
    changeCurrentFile(item)
    try {
      changeOHA(JSON.parse(item.content))
    } catch (e) {
      addError("Couldn't parse content into JSON")
    }
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
            content,
            id: Math.random()
              .toString()
              .split(".")[1]
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
          onOpenFile: handleOpenFile,
          onOpenRecentItem: openRecentItem
        }}
      >
        {pageName === "welcome" ? (
          <StartingPage
            onFileDrop={handleOpenFile}
            onOpenTemplate={onCreateTemplate}
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
    </>
  )
}
