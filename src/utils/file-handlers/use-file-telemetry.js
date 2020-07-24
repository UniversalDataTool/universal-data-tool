// @flow weak

import { useEffect } from "react"
import usePosthog from "../../utils/use-posthog"
const posthog = usePosthog()

export default (udt) => {
  const udtInterface = udt?.interface
  useEffect(() => {
    if (!udtInterface) return
    posthog.capture("interface_type", { interface_type: udtInterface.type })
    posthog.people.set({ last_used_interface_type: udtInterface.type })
  }, [udtInterface])

  const udtSamples = udt?.samples
  useEffect(() => {
    if (!udtSamples) return
    const numCompleted = (udt.samples || []).filter((s) => s.annotation).length
    posthog.capture("samples_updated", {
      dataset_size: (udt.samples || []).length,
      samples_completed: numCompleted,
      percent_completed: numCompleted / (udt.samples || []).length,
      toy_dataset_used: Boolean(udt?.usedToyDataset),
    })
    posthog.people.set({
      recently_used_toy_dataset: Boolean(udt?.usedToyDataset),
    })
  }, [udtSamples])
}
