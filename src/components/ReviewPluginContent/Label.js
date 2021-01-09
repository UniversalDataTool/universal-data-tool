import React from "react"
import Recoil from "recoil"
import { CircularProgress, Box, Button } from "@material-ui/core"
import UniversalSampleEditor from "../UniversalSampleEditor"
import { useAssignedSample } from "udt-review-hooks"

export const Label = () => {
  const { sample, submit, reassign, error, loadingSample } = useAssignedSample()
  if (!sample)
    return (
      <Box textAlign="center" pt="32px">
        <CircularProgress size={50} />
      </Box>
    )
  return (
    <>
      <UniversalSampleEditor
        sampleIndex={sample.sample_index}
        sample={sample.sample_data}
        interface={sample.interface}
        onModifySample={async (sample) => {
          await submit(sample.annotation)
        }}
        onExit={() => null}
      />
      <Button onClick={reassign}>Reassign</Button>
    </>
  )
}

export default Label
