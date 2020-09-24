import React, { useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import SimpleDialog from "../SimpleDialog"
import CreatableSelect from "react-select/creatable"

import FormGroup from "@material-ui/core/FormGroup"
import Box from "@material-ui/core/Box"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { setIn } from "seamless-immutable"

const Image = styled("img")({
  width: 100,
  height: 100,
  margin: 8,
})

export const ImportFromCOCODialog = ({
  open,
  onClose,
  onChangeDataset,
  dataset,
}) => {
  const [labelsSelected, setLabelsSelected] = useState([])
  const [exclusive, setExclusive] = useState()
  const [shouldReplaceInterface, setShouldReplaceInterface] = useState()
  const [importedDataset, setImportedDataset] = useState(null)

  useEffect(() => {
    if (labelsSelected.length === 0) return
    async function loadSamples() {
      const ds = await fetch(
        `https://coco.universaldatatool.com/api/captions?labels=${encodeURIComponent(
          labelsSelected.join(",")
        )}${exclusive ? "&exclusive" : ""}`
      ).then((r) => r.json())
      setImportedDataset(ds)
    }
    loadSamples()
  }, [exclusive, labelsSelected])

  return (
    <SimpleDialog
      open={open}
      title="Import from COCO"
      onClose={onClose}
      actions={[
        {
          text: "Add Samples",
          disabled: !importedDataset,
          onClick: () => {
            onChangeDataset(
              setIn(
                dataset,
                ["samples"],
                dataset.samples.concat(importedDataset.samples)
              ).setIn(["interface"], importedDataset.interface)
            )
            onClose()
          },
        },
      ]}
    >
      <CreatableSelect
        isMulti
        onChange={(labels) => {
          setLabelsSelected((labels || []).map((l) => l.value))
        }}
        options={[]}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={exclusive}
              onChange={(e, checked) => setExclusive(checked)}
            />
          }
          label="Exclusive (Single Classification)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldReplaceInterface}
              onChange={(e, checked) => setShouldReplaceInterface(checked)}
            />
          }
          label="Replace Interface?"
        />
      </FormGroup>
      <Box padding={2} minHeight="400px">
        {(importedDataset?.samples || []).slice(0, 9).map((s) => (
          <Image src={s.imageUrl} />
        ))}
      </Box>
    </SimpleDialog>
  )
}

export default ImportFromCOCODialog
