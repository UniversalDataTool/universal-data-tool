import { useState, useMemo, useDebugValue } from "react"

export default (clobber, defaultIfNotClobbered) => {
  const isClobbered = useMemo(
    () => clobber !== undefined,
    //eslint-disable-next-line
    []
  )
  useDebugValue(isClobbered ? "Clobbered" : "Not Clobbered")
  const [notClobberedValue, setNotClobberedValue] = useState(
    defaultIfNotClobbered
  )
  if (isClobbered) {
    return [clobber, undefined]
  } else {
    return [notClobberedValue, setNotClobberedValue]
  }
}
