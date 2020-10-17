import useActiveDatasetManager from "../use-active-dataset-manager"
import { useState, useEffect } from "react"

export default () => {
  const [dm] = useActiveDatasetManager()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!dm) return
    async function checkIfReady() {
      const newReadyState = await dm.isReady()
      if (newReadyState !== isReady) {
        setIsReady(newReadyState)
      }
    }

    dm.on("connected", checkIfReady)
    dm.on("disconnected", checkIfReady)

    return () => {}
  }, [dm, isReady])

  if (!dm) return false
}
