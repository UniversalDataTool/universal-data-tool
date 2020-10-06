import { useEffect, useState } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

export default () => {
  const [dm] = useActiveDatasetManager()
  const [retVal, setRetVal] = useState({ summaryLoading: true, summary: {} })

  useEffect(() => {
    if (!dm) return { summaryLoading: true, summary: {} }

    dm.getSummary().then((summary) => {
      setRetVal({ summaryLoading: false, summary })
    })
    dm.on("summary-changed", () => {
      dm.getSummary().then((summary) => {
        setRetVal({ summaryLoading: false, summary })
      })
    })
  }, [dm])

  return retVal
}
