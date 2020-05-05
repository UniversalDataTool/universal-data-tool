import posthog from "posthog-js"
import useElectron from "./use-electron"

window.posthogInitialized = false
export default () => {
  const isDesktop = Boolean(useElectron())
  if (!window.posthogInitialized) {
    posthog.init("dSrx1PbFd02XsxlLd7qNbeTxKZwwao2sclVmapyYlT4", {
      api_host: "https://posthog.universaldatatool.com",
      autocapture: false,
    })
    window.posthog = posthog
    const domain = isDesktop ? "desktop" : window.location.origin
    posthog.capture("domain", { domain })
    posthog.capture("is_desktop", { isDesktop: isDesktop })
    posthog.people.set({ is_desktop: isDesktop, domain })
    window.posthogInitialized = true
  }
  return posthog
}
