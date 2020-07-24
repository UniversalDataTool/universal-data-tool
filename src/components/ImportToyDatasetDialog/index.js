// @flow weak

import React from "react"
import SimpleDialog from "../SimpleDialog"
import { styled } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { useTranslation } from "react-i18next"

const datasets = [
  { name: "Elon Musk Tweets", type: "text", size: 2800 },
  { name: "Cats", type: "image", size: 360 },
  { name: "VR Hand Pinching", type: "image", size: 20517 },
  { name: "AI Generated Faces", type: "image", size: 1999 },
  { name: "Text to Speech Audio", type: "audio", size: 200 },
]

async function getSamples(dataset) {
  const datasetName =
    dataset.name.toLowerCase().replace(/ /g, "_") + ".udt.json"

  const datasetUrl = `https://s3.amazonaws.com/datasets.workaround.online/${datasetName}`

  return await fetch(datasetUrl)
    .then((r) => r.json())
    .then((r) => r.samples || r.taskData)
}

const StyledButton = styled(Button)({})

const ImportToyDatasetDialog = ({ onClose, onAddSamples, open }) => {
  const { t } = useTranslation()

  return (
    <SimpleDialog onClose={onClose} open={open} title="Import Toy Dataset">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("type")}</TableCell>
              <TableCell>{t("size")}</TableCell>
              <TableCell>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((dataset) => (
              <TableRow key={dataset.name}>
                <TableCell>{dataset.name}</TableCell>
                <TableCell>{dataset.type}</TableCell>
                <TableCell>{dataset.size}</TableCell>
                <TableCell>
                  <StyledButton
                    data-import-toy-dataset-name={dataset.name}
                    onClick={async () => {
                      onAddSamples(await getSamples(dataset))
                    }}
                    variant="outlined"
                  >
                    {t("import")}
                  </StyledButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SimpleDialog>
  )
}

export default ImportToyDatasetDialog
