// @flow

import { useState } from "react"

export default (key: string, defaultValue: Object) => {
  const [state, changeState] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(key))
    } catch (e) {
      return defaultValue
    }
  })

  const changeValue = (newValue) => {
    window.localStorage.setItem(key, JSON.stringify(newValue))
    changeState(newValue)
  }

  return [state, changeValue]
}
