import React from "react"
import {
  Button,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core"
import { useDatasetSettings } from "udt-review-hooks"

export const QualityContent = () => {
  const { updateDatasetSettings, dataset, loading } = useDatasetSettings()
  const [newSettings, setNewSetting] = React.useReducer(
    (state, [key, value]) =>
      key === "erase" ? {} : { ...state, [key]: value },
    {}
  )

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
      {loading ? (
        <Box textAlign="center" padding="32px">
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          <TextField
            style={{ marginTop: 64 }}
            value={"100%"}
            disabled
            variant="outlined"
            label="Coverage"
            helperText="Percentage of dataset that requires consensus to be reached."
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <TextField
            style={{ marginTop: 32 }}
            defaultValue={dataset.votes_per_sample}
            onChange={(e) => {
              setNewSetting(["votes_per_sample", parseInt(e.target.value)])
            }}
            variant="outlined"
            label="Votes"
            helperText="Number of times each sample will be labeled"
          />
        </>
      )}
      <Box mt="16px" textAlign="right">
        <Button
          disabled={loading || Object.keys(newSettings).length === 0}
          variant="outlined"
          color="primary"
          onClick={async () => {
            setNewSetting(["erase"])
            await updateDatasetSettings(newSettings)
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default QualityContent
