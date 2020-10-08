import { useEffect, useState } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

export default (sampleIndexOrId) => {
  const [
    { currentSampleId, currentSampleIndex, sample },
    setCurrentSample,
  ] = useState({})
  const [dm] = useActiveDatasetManager()

  useEffect(() => {
    if (sampleIndexOrId === undefined || sampleIndexOrId === null) {
      setCurrentSample({ currentSampleId: null })
      return
    }
    async function loadSample() {
      const summary = await dm.getSummary()
      let sampleIndex, sampleId

      if (typeof sampleIndexOrId === "string") {
        sampleIndex = summary.samples.findIndex((s) => s.id === sampleIndexOrId)
      } else if (typeof sampleIndexOrId === "number") {
        if (sampleIndexOrId >= summary.samples.length) {
          setCurrentSample({ currentSampleId: null })
          return
        }
        sampleId = summary.samples[sampleIndexOrId]._id
      }

      if (!sampleId) {
        console.log(`sample index or id is missing "${sampleIndexOrId}"`)
        return
      }

      const sample = await dm.getSample(sampleId)

      setCurrentSample({
        currentSampleId: sampleId,
        currentSampleIndex: sampleIndex,
        sample,
      })
    }
    loadSample()
  }, [sampleIndexOrId, dm])

  if (!dm)
    return {
      sampleLoading: true,
      currentSampleIndex: null,
      currentSampleId: null,
      sample: null,
      updateSample: () => {
        throw new Error("no sample loaded")
      },
    }

  return {
    sampleLoading: !sample,
    currentSampleIndex,
    currentSampleId,
    sample,
    updateSample: async (newSample) => {
      await dm.setSample(currentSampleId, newSample)
    },
  }
}
