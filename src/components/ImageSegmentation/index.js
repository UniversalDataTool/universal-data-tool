// @flow

import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Annotator from "react-image-annotate"

const useStyles = makeStyles({})

export default ({ interface: iface, taskData = [] }) => {
  const c = useStyles()

  return (
    <Annotator
      images={[
        {
          src:
            "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image1.jpg",
          name: "Image 1"
        }
      ]}
    />
  )
}
