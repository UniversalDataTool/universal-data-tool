// @flow

import { useState, useEffect } from "react"

const REFRESH_INTERVAL = 100

export default () => {
  const [errors, changeErrors] = useState([])
  useEffect(() => {
    if (errors.length === 0) return () => {}
    let interval = setInterval(() => {
      changeErrors(
        errors
          .map((err) => ({
            ...err,
            life: err.life - REFRESH_INTERVAL,
          }))
          .filter((err) => err.life > 0)
      )
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [errors])

  function addError(message: string) {
    changeErrors(
      errors.concat([
        {
          id: Math.random().toString().split(".")[1],
          message,
          life: 5000,
        },
      ])
    )
  }

  return [errors, addError]
}
