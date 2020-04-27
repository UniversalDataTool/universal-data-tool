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
    if (!udt || !udt.taskData) return
    posthog.capture("dataset_size", {
      dataset_size: (udt.taskData || []).length,
    })
  }, [udt])
  useEffect(() => {
    if (!udt || !udt.taskOutput) return
    const numCompleted = udt.taskOutput.filter(Boolean).length
    posthog.capture("sample_completion", {
      dataset_size: (udt.taskData || []).length,
      samples_completed: numCompleted,
      percent_completed: numCompleted / (udt.taskData || []).length,
    })
  }, [udt])
}
