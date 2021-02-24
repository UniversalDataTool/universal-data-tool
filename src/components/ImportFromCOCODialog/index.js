import React, { useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import SimpleDialog from "../SimpleDialog"
import CreatableSelect from "react-select/creatable"

import FormGroup from "@material-ui/core/FormGroup"
import Box from "@material-ui/core/Box"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const Image = styled("img")({
  width: 100,
  height: 100,
  margin: 8,
})

const TermsOfUse = styled("div")({
  padding: 16,
  margin: 16,
  backgroundColor: colors.green[200],
  "& a": {
    color: colors.blue[600],
  },
})

export const ImportFromCOCODialog = ({ open, onClose, onAddSamples }) => {
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
        importedDataset?.samples.length > 0 && {
          text: "Add Samples",
          disabled: !importedDataset,
          onClick: () => {
            onAddSamples(importedDataset.samples)
            onClose()
          },
        },
      ].filter(Boolean)}
    >
      <TermsOfUse>
        By clicking "Add Samples" you understand that these images are from the{" "}
        <a href="https://cocodataset.org">Common Objects in Context dataset</a>{" "}
        and you must abide by{" "}
        <a href="https://cocodataset.org/#termsofuse">their terms of use</a>.
      </TermsOfUse>
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
