// @flow weak

import { useEffect } from "react"

function preventNavigation(e) {
  var confirmationMessage =
    "It looks like you have been editing something. " +
    "If you leave before saving, your changes will be lost."

  ;(e || window.event).returnValue = confirmationMessage //Gecko + IE
  return confirmationMessage //Gecko + Webkit, Safari, Chrome etc.
}

export default (shouldPreventNavigation = true) => {
  useEffect(() => {
    if (!shouldPreventNavigation) return
    if (window.location.origin.includes("localhost")) return
    window.addEventListener("beforeunload", preventNavigation)
    return () => {
      window.removeEventListener("beforeunload", preventNavigation)
    }
  }, [shouldPreventNavigation])
}
