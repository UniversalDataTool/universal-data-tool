// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"
import Box from "@material-ui/core/Box"
import Select from "react-select"
import range from "lodash/range"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

export default ({ open, onChangeDataset, onClose, dataset }) => {
  const [errors, setErrors] = useState("")
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Convert Segments to Image Samples"
      actions={[
        {
          text: "Convert Segments to Image Samples",
          onClick: async () => {
            const imageUrls = Array.from(
              new Set(dataset.samples.map((s) => s.imageUrl))
            )
            console.log({ imageUrls })
            const newDataset = {
              ...dataset,
              samples: [],
            }
            for (const imageUrl of imageUrls) {
              const pieces = dataset.samples.filter(
                (s) => s.imageUrl === imageUrl
              )
              newDataset.samples.push({
                imageUrl,
                annotation: pieces.flatMap((p) => p.annotation).filter(Boolean),
              })
            }
            onChangeDataset(newDataset)
            onClose()
          },
        },
      ]}
    >
      This transformation will take image samples that have been split into
      segments (each with an allowedArea), and combine them into one image
      sample again. This is typically executed after a splitting operation when
      the samples are to be recombined.
      {errors && <ErrorBox>{errors}</ErrorBox>}
    </SimpleDialog>
  )
}
