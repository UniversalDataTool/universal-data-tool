// @flow
import { useEffect, useRef } from "react"
import { useLocalStorage } from "react-use"
import * as datasetHelper from "../../utils//dataset-helper"
export default (file, changeFile) => {
  let [recentItems, changeRecentItems] = useLocalStorage("recentItems", [])
  const oldRecentItems = useRef([])
  if (!recentItems) recentItems = []
  useEffect(() => {
    if (!file || file.fileName === "unnamed") return
    if(datasetHelper.getFileDifferences(oldRecentItems.current, recentItems).any){
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
    oldRecentItems.current = recentItems
  }, [file, changeRecentItems, recentItems])
  return { recentItems, changeRecentItems }
}
