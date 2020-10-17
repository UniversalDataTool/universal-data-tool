import posthog from "posthog-js"
import useElectron from "../use-electron"

const posthogMock = {
  opt_in_capturing: () => null,
  opt_out_capturing: () => null,
  init: () => null,
  reset: () => null,
  capture: () => null,
  capture_forms: () => null,
  capture_pageview: () => null,
  register: () => null,
  register_once: () => null,
  unregister: () => null,
  identify: () => "mock",
  alias: () => null,
  set_config: () => null,
  get_config: () => null,
  get_property: () => null,
  get_distinct_id: () => null,
  has_opted_out_capturing: () => true,
  has_opted_in_capturing: () => false,
  disable_all_events: () => null,
  people: {
    set: () => null,
    set_once: () => null,
  },
}

window.posthogInitialized = false
export default () => {
  const isDesktop = Boolean(useElectron())
  if (window.Cypress) {
    window.posthogInitialized = true
    window.posthog = posthogMock
  }
  if (!window.posthogInitialized) {
    posthog.init("dSrx1PbFd02XsxlLd7qNbeTxKZwwao2sclVmapyYlT4", {
      api_host: "https://posthog.universaldatatool.com",
      autocapture: false,
    })
    window.posthog = posthog
    const domain = isDesktop
      ? "https://desktop.universaldatatool.com"
      : window.location.origin
    posthog.capture("domain", { domain })
    posthog.capture("is_desktop", { isDesktop: isDesktop })
    posthog.people.set({ is_desktop: isDesktop, domain })
    window.posthogInitialized = true
  }
  return window.posthog
}
