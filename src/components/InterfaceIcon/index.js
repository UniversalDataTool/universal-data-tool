import React from "react"

import RemoveRedEye from "@material-ui/icons/RemoveRedEye"
import TextFormat from "@material-ui/icons/TextFormat"
import Edit from "@material-ui/icons/Edit"
import OndemandVideo from "@material-ui/icons/OndemandVideo"
import Audiotrack from "@material-ui/icons/Audiotrack"
import Help from "@material-ui/icons/Help"

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
    default:
      return <Help {...props} />
  }
}
