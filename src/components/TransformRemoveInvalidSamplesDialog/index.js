// @flow weak

import React, { useState } from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import { setIn } from "seamless-immutable"
import Box from "@material-ui/core/Box"
import range from "lodash/range"
import TextField from "@material-ui/core/TextField"
import ProgressBar from "../ProgressBar"

const ErrorBox = styled("pre")({
  color: "red",
  whiteSpace: "prewrap",
  fontSize: 11,
})

async function isUrlValid(url) {
  const controller = new AbortController()
  const { signal } = controller

  const resPromise = fetch(url, { signal }).catch((e) => e)

  setTimeout(() => {
    controller.abort()
  }, 100)

  const result = await resPromise
  if (result.toString().includes("AbortError")) {
    return true
  } else {
    return result.status === 200
  }
}

export default ({ open, onChangeDataset, onClose, dataset }) => {
  // const [errors, setErrors] = useState("")
  const [filteredSamples, setFilteredSamples] = useState()
  const [
    { samplesRemoved, samplesProcessed, complete },
    setProcessState,
  ] = useState({
    samplesRemoved: 0,
    samplesProcessed: 0,
    complete: false,
  })
  return (
    <SimpleDialog
      open={open}
      onClose={onClose}
      title="Remove Invalid Samples"
      actions={[
        {
          text: "Find Invalid Samples",
          onClick: async () => {
            const samples = []
            let samplesProcessed = 0,
              samplesRemoved = 0
            // TODO add parallelism
            for (const sample of dataset.samples) {
              setProcessState({
                samplesRemoved,
                samplesProcessed,
                complete: false,
              })
              samplesProcessed += 1
              const requestUrl = sample.imageUrl
              if (!requestUrl || !requestUrl.startsWith("http")) {
                samples.push(sample)
                continue
              }
              if (await isUrlValid(requestUrl)) {
                samples.push(sample)
                continue
              }
              samplesRemoved += 1
            }

            setProcessState({
              samplesRemoved,
              samplesProcessed,
              complete: true,
            })
            setFilteredSamples(samples)
          },
        },
        complete && {
          text: "Remove Invalid Samples",
          onClick: async () => {
            onChangeDataset(setIn(dataset, ["samples"], filteredSamples))
          },
        },
      ].filter(Boolean)}
    >
      <ProgressBar
        progress={
          complete
            ? 100
            : (samplesProcessed / (dataset.samples?.length + 1)) * 100
        }
      />
      <div>
        Samples processed: {samplesProcessed}
        <br />
        Samples to be removed: {samplesRemoved}
        <br />
        Total samples: {dataset.samples?.length}
      </div>
      <div style={{ marginTop: 16 }}>
        This transformation will try to request each sample's url, if any of
        them do not return a valid status code the sample will be removed from
        the dataset.
      </div>
      {/* {errors && <ErrorBox>{errors}</ErrorBox>} */}
    </SimpleDialog>
  )
}
