// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"
import Box from "@material-ui/core/Box"
import range from "lodash/range"
import TextField from "@material-ui/core/TextField"
import useDataset from "../../hooks/use-dataset"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

export default ({ open, onClose }) => {
  const [errors, setErrors] = useState("")
  const [rows, setRows] = useState("2")
  const [columns, setColumns] = useState("2")
  const [dataset, setDataset] = useDataset()
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Convert Image Samples into Segments"
      actions={[
        {
          text: "Convert Image Samples into Segments",
          onClick: async () => {
            const [nRows, nCols] = [parseInt(rows), parseInt(columns)]

            try {
              setDataset(
                setIn(
                  dataset,
                  ["samples"],
                  range(nRows).flatMap((y) =>
                    range(nCols).flatMap((x) =>
                      dataset.samples.map((s) => {
                        return setIn(s, ["allowedArea"], {
                          x: x / nCols,
                          y: y / nRows,
                          width: 1 / nCols,
                          height: 1 / nRows,
                        })
                      })
                    )
                  )
                )
              )
              onClose()
            } catch (e) {
              setErrors(e.toString())
            }
          },
        },
      ]}
    >
      This transformation will multiply the number of image samples you have,
      splitting each individual image into segments. The image is not processed
      and clipped, but rather an "allowedArea" property is placed on the sample
      which limits the labeling to a section of the image. This is useful when
      trying to reduce the amount of work per image sample.
      <Box padding={4}>
        <TextField
          label="Rows"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
        />
        <TextField
          label="Columns"
          value={columns}
          onChange={(e) => setColumns(e.target.value)}
        />
      </Box>
      {errors && <ErrorBox>{errors}</ErrorBox>}
    </SimpleDialog>
  )
}
