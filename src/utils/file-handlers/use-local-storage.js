// @flow
import { useEffect, useRef } from "react"
import { useLocalStorage } from "react-use"
import getFileDifferences from "../dataset-helper/get-files-differences"
export default (file, changeFile) => {
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  const oldRecentItems = useRef([])
  if (!recentItems) recentItems = []
  useEffect(() => {
    if (!file || file.fileName === "unnamed") return
    if (getFileDifferences(oldRecentItems.current, recentItems).any) {
      oldRecentItems.current = recentItems
      return
    }
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
