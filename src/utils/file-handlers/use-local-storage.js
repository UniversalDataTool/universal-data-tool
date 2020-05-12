// @flow
import { useRef, useEffect } from "react"
import { useLocalStorage } from "react-use"
import jsonHandler from "../../utils/file-handlers/udt-helper"
import isEmpty from "../../utils/isEmpty"
export default (file, changeFile) => {
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])

  if (!recentItems) recentItems = []
  const lastObjectRef = useRef([])
  useEffect(() => {
    if (!isEmpty(file) && file.fileName === "unnamed") return
    var changes = jsonHandler.fileHasChanged(lastObjectRef.current, file)
    if (!changes.any) return
    if (recentItems.map((item) => item.id).includes(file.id)) {
      changeRecentItems(
        recentItems.map((ri) => (ri.id === file.id ? file : ri))
      )
    } else {
      changeRecentItems([file].concat(recentItems).slice(0, 3))
    }
    lastObjectRef.current = file
  }, [file, changeRecentItems, recentItems])
  return { recentItems, changeRecentItems }
}
