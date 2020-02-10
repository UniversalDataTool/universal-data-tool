// @flow weak

import React from "react"
import ConfigureInterface from "../ConfigureInterface"

export default ({ oha, onChange, onClickEditJSON }) => {
  const { interface: iface } = oha
  return (
    <div>
      <ConfigureInterface
        iface={iface}
        onChange={onChange}
        onClickEditJSON={onClickEditJSON}
      />
    </div>
  )
}
