import React from "react"
import { Box, TextField, InputAdornment } from "@material-ui/core"

export const QualityContent = () => {
  return (
    <Box display="flex" flexDirection="column" padding={4}>
      <Box fontSize={14} lineHeight={1.5}>
        Quality is controlled by assigning multiple labelers each dataset
        sample. Each labeler's work is checked against other labelers who have
        labeled the same sample. Based on the agreement or disagreement, the
        incorrect labeler(s) will be notified and worker statistics relating to
        accuracy will be updated.
        <br />
        <br />
        You can configure specific settings to ensure higher overall dataset
        quality or increase the speed of the labeling operation.
      </Box>
      <TextField
        style={{ marginTop: 64 }}
        value={"75"}
        variant="outlined"
        label="Coverage"
        helperText="Percentage of dataset that requires consensus to be reached."
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
      />
      <TextField
        style={{ marginTop: 32 }}
        value={"3"}
        variant="outlined"
        label="Votes"
        helperText="Number of times each sample will be labeled"
      />
    </Box>
  )
}

export default QualityContent
