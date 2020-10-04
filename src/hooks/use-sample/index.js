import { useEffect, useState } from "react"
import useActiveDatasetManager from "../use-active-dataset-manager"

export default (sampleIndexOrId) => {
  const [
    { currentSampleId, currentSampleIndex, sample },
    setCurrentSample,
  ] = useState()
  const [dm] = useActiveDatasetManager()

  useEffect(() => {
    async function loadSample() {
      if (!sampleIndexOrId) {
        setCurrentSample({ currentSampleId: null })
        return
      }

      const summary = await dm.getSummary()
      let sampleIndex, sampleId

      if (typeof sampleIndexOrId === "string") {
        sampleIndex = summary.samples.findIndex((s) => s.id === sampleIndexOrId)
      } else if (typeof sampleIndexOrId === "number") {
        sampleId = summary.samples[sampleId]._id
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
    if (sampleIndexOrId) {
      loadSample()
    }
  }, [sampleIndexOrId, dm])

  if (!dm)
    return {
      sampleLoading: true,
      currentSampleIndex: null,
      currentSampleId: null,
      sample: null,
      updateSample: () => throw new Error("no sample loaded"),
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
