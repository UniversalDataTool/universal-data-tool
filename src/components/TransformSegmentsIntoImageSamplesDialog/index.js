// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"

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
            try {
              const imageUrls = Array.from(
                new Set(dataset.samples.map((s) => s.imageUrl))
              )
              const newSamples = []
              for (const imageUrl of imageUrls) {
                const pieces = dataset.samples.filter(
                  (s) => s.imageUrl === imageUrl
                )
                newSamples.push({
                  imageUrl,
                  annotation: pieces
                    .flatMap((p) => p.annotation)
                    .filter(Boolean),
                })
              }
              onChangeDataset(setIn(dataset, ["samples"], newSamples))
              onClose()
            } catch (e) {
              setErrors(e.toString())
            }
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
