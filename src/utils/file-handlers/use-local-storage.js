// @flow
import { useEffect } from "react"
import { useLocalStorage } from "react-use"

export default (file, changeFile) => {
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])

  if (!recentItems) recentItems = []
  useEffect(() => {
    if (!file || file.fileName === "unnamed") return
    if (recentItems.map((item) => item.id).includes(file.id)) {
      changeRecentItems(
        recentItems.map((ri) => (ri.id === file.id ? file : ri))
      )
    } else {
      changeRecentItems([file].concat(recentItems).slice(0, 3))
    }
    // eslint-disable-next-line
  }, [file, changeRecentItems])
  return { recentItems, changeRecentItems }
}
