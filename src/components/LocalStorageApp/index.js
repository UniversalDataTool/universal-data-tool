// @flow
import React, { useState } from "react"
import { HeaderContext } from "../Header"
import StartingPage from "../StartingPage"
import OHAEditor from "../OHAEditor"
import { makeStyles } from "@material-ui/core/styles"
import { useLocalStorage } from "@rehooks/local-storage"
import ErrorToasts from "../ErrorToasts"
import useErrors from "../../utils/use-errors.js"

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
  const [errors, addError] = useErrors([])
  const [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])

  return (
    <>
      <HeaderContext.Provider value={{ recentItems }}>
        {pageName === "welcome" ? (
          <StartingPage
            onFileDrop={file => {
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
            }}
          />
        ) : pageName === "edit" && currentFile ? (
          <OHAEditor
            {...currentFile}
            oha={oha}
            onChangeFileName={newName => {
              changeCurrentFile({ ...currentFile, fileName: newName })
            }}
            onChangeContent={newContent => {
              changeCurrentFile({ ...currentFile, content: newContent })
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
