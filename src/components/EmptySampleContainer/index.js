// @flow

import React from "react"
import BadOHA from "../BadOHA"

export default () => {
  return (
    <BadOHA title="No Samples to Show">
      Make sure that <code>samples</code> is defined and not empty.
      <br />
      <br />
      Need help setting up? <a href="#">Check out this tutorial.</a>
    </BadOHA>
  )
}
