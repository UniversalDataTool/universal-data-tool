import posthog from "posthog-js"
import useElectron from "./use-electron"

window.posthogInitialized = false
export default () => {
  const isDesktop = Boolean(useElectron())
  if (!window.posthogInitialized) {
    posthog.init("8ieaFOCUBS195OEkGCHl84_DsY03sSPKpzV00JYjf7M", {
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
