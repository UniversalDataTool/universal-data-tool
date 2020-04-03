// @flow

import { useLocalStorage } from "react-use"
import { useEffect } from "react"

export default (file, changeFile) => {
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  if (!recentItems) recentItems = []

  useEffect(() => {
    if (!file) return
    if (!file.fileName || file.fileName === "unnamed") return
    if (file.mode !== "local-storage" && file.mode !== "filesystem") return
    if (recentItems.map((item) => item.id).includes(file.id)) {
      changeRecentItems(
        recentItems.map((ri) => (ri.id === file.id ? file : ri))
      )
    } else {
      changeRecentItems([file].concat(recentItems).slice(0, 3))
    }
  }, [file])

  return { recentItems }
}
