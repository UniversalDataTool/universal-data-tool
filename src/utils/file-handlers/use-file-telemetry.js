// @flow weak

import { useEffect } from "react"
import usePosthog from "../../hooks/use-posthog"
const posthog = usePosthog()

export default (udt) => {
  const udtInterface = udt?.interface
  useEffect(() => {
    if (!udtInterface) return
    posthog.capture("interface_type", { interface_type: udtInterface.type })
    posthog.people.set({ last_used_interface_type: udtInterface.type })
  }, [udtInterface])

  const udtSamples = udt?.samples
  const usedToyDataset = udt?.usedToyDataset
  useEffect(() => {
    if (!udtSamples) return
    const numCompleted = (udtSamples || []).filter((s) => s.annotation).length
    posthog.capture("samples_updated", {
      dataset_size: (udtSamples || []).length,
      samples_completed: numCompleted,
      percent_completed: numCompleted / (udtSamples || []).length,
      toy_dataset_used: Boolean(usedToyDataset),
    })
    posthog.people.set({
      recently_used_toy_dataset: Boolean(usedToyDataset),
    })
  }, [udtSamples, usedToyDataset])
}
