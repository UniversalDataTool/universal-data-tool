// @flow weak

import { useEffect } from "react"
import usePosthog from "../../utils/use-posthog"
const posthog = usePosthog()

export default (udt) => {
  useEffect(() => {
    if (!udt || !udt.interface) return
    posthog.capture("interface_type", { interface_type: udt.interface.type })
    posthog.people.set({ last_used_interface_type: udt.interface.type })
  }, [udt])
  useEffect(() => {
    if (!udt || !udt.samples) return
    posthog.capture("dataset_size", {
      dataset_size: (udt.samples || []).length,
    })
  }, [udt])
  useEffect(() => {
    if (!udt || !udt.samples) return
    const numCompleted = (udt.samples || []).filter((s) => s.annotation).length
    posthog.capture("sample_completion", {
      dataset_size: (udt.samples || []).length,
      samples_completed: numCompleted,
      percent_completed: numCompleted / (udt.samples || []).length,
    })
  }, [udt])
}
