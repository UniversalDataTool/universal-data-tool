// @flow

import React from "react"
import BadDataset from "../BadDataset"

export default () => {
  return (
    <BadDataset title="No Samples to Show">
      Make sure that <code>samples</code> is defined and not empty.
      <br />
      <br />
      Need help setting up? {/*<a href="#">Check out this tutorial.</a>*/}
    </BadDataset>
  )
}
