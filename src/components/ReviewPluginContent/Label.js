import React from "react"
import UniversalSampleEditor from "../UniversalSampleEditor"

export const Label = () => {
  return (
    <UniversalSampleEditor
      sampleIndex={1}
      sample={{
        imageUrl:
          "https://s3.amazonaws.com/datasets.workaround.online/satimag.jpeg",
      }}
      interface={{
        type: "image_segmentation",
      }}
    />
  )
}

export default Label
