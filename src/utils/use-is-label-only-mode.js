import useIsDesktop from "./../hooks/use-is-desktop"
export default () => {
  const isDesktop = useIsDesktop()
  if (isDesktop) return false
  if (window.location.search.includes("mode=labelonly")) {
    return true
  }
  return false
}
