import React from "react"

import RemoveRedEye from "@material-ui/icons/RemoveRedEye"
import TextFormat from "@material-ui/icons/TextFormat"
import Edit from "@material-ui/icons/Edit"
import Audiotrack from "@material-ui/icons/Audiotrack"
import Help from "@material-ui/icons/Help"
import ThreeDRotation from "@material-ui/icons/ThreeDRotation"

export default ({ type, ...props }) => {
  switch (type) {
    case "image_label":
    case "image_segmentation":
      return <RemoveRedEye {...props} />
    case "audio_transcription":
      return <Audiotrack {...props} />
    case "data_entry":
      return <Edit {...props} />
    case "text_entity_recognition":
      return <TextFormat {...props} />
    case "3d_bounding_box":
      return <ThreeDRotation {...props} />
    default:
      return <Help {...props} />
  }
}
