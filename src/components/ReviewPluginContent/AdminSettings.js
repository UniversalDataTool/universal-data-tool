import React from "react"
import Recoil from "recoil"
import { Box, Button, CircularProgress } from "@material-ui/core"
import { activeDatasetAtom, useAddDataset } from "udt-review-hooks"
import useActiveDatasetManager from "../../hooks/use-active-dataset-manager"

export const AdminSettings = () => {
  const [activeDataset, setActiveDataset] = Recoil.useRecoilState(
    activeDatasetAtom
  )
  const [dm] = useActiveDatasetManager()
  const [loading, setLoading] = React.useState(false)
  const addDataset = useAddDataset()

  return (
    <Box display="flex" flexDirection="column" padding={4}>
      {loading ? (
        <CircularProgress size={50} color="primary" />
      ) : activeDataset ? (
        <Box>
          <Box fontSize={14} lineHeight={1.5}>
            Your dataset is loaded.
          </Box>
          <Box mt={4}>
            <Button variant="outlined" color="primary">
              Download Dataset
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box fontSize={14} lineHeight={1.5}>
            This dataset is being stored locally.
          </Box>
          <Box mt={4}>
            <Button
              onClick={async () => {
                setLoading(true)
                const ds = await dm.getDataset()
                const display_name = window.prompt(
                  "What do you want to name this dataset?"
                )
                if (!display_name) {
                  setLoading(false)
                  return
                }
                const cloudDS = await addDataset({
                  udt_dataset: ds,
                  display_name,
                })
                setActiveDataset(cloudDS)
                setLoading(false)
              }}
              variant="outlined"
              color="primary"
            >
              Begin Managing This Dataset
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AdminSettings
