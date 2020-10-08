import { useEffect, useState } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

export default () => {
  const [dm] = useActiveDatasetManager()
  const [retVal, setRetVal] = useState({ summaryLoading: true, summary: {} })

  useEffect(() => {
    if (!dm) return { summaryLoading: true, summary: {} }

    function loadSummary() {
      dm.getSummary().then((summary) => {
        setRetVal({ summaryLoading: false, summary })
      })
    }

    loadSummary()
    dm.on("summary-changed", loadSummary)
    return () => {
      dm.off("summary-changed", loadSummary)
    }
  }, [dm])

  return retVal
}
