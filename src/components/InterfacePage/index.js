// @flow weak

import React from "react"
import ConfigureInterface from "../ConfigureInterface"

export default ({ oha, onChange }) => {
  const { interface: iface } = oha
  return (
    <div>
      <ConfigureInterface iface={iface} />
    </div>
  )
}
