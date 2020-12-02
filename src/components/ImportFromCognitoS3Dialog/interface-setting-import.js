import React from "react"
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core/"
const setting = ({ configImport, setConfigImport }) => {
  console.log(configImport)
  console.log(setConfigImport)
  return (
    <tr>
      <th>
        {!configImport.loadAssetsIsSelected ? (
          <FormControl component="fieldset">
            <FormLabel component="legend">Annotation processing</FormLabel>
            <RadioGroup
              aria-label="option1"
              onChange={(event) => {
                setConfigImport({
                  ...configImport,
                  annotationToKeep: event.target.value,
                })
              }}
            >
              <FormControlLabel
                value="both"
                control={<Radio />}
                label="Keep both annotations"
                checked={configImport.annotationToKeep === "both"}
              />
              <FormControlLabel
                value="incoming"
                control={<Radio />}
                label="Keep incoming annotations"
                checked={configImport.annotationToKeep === "incoming"}
              />
              <FormControlLabel
                value="current"
                control={<Radio />}
                label="Keep current annotations"
                checked={configImport.annotationToKeep === "current"}
              />
            </RadioGroup>
          </FormControl>
        ) : (
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose file type</FormLabel>
            <RadioGroup
              aria-label="option2"
              onChange={(event) => {
                setConfigImport({
                  ...configImport,
                  typeOfFileToLoad: event.target.value,
                })
              }}
            >
              <FormControlLabel
                value="Image"
                control={<Radio />}
                label="Load image file"
                disabled={configImport.typeOfFileToDisable.Image}
                checked={configImport.typeOfFileToLoad === "Image"}
              />
              <FormControlLabel
                value="Video"
                control={<Radio />}
                label="Load video file"
                disabled={configImport.typeOfFileToDisable.Video}
                checked={configImport.typeOfFileToLoad === "Video"}
              />
              <FormControlLabel
                value="Audio"
                control={<Radio />}
                label="Load audio file"
                disabled={configImport.typeOfFileToDisable.Audio}
                checked={configImport.typeOfFileToLoad === "Audio"}
              />
              <FormControlLabel
                value="PDF"
                control={<Radio />}
                label="Load PDF file"
                disabled={configImport.typeOfFileToDisable.PDF}
                checked={configImport.typeOfFileToLoad === "PDF"}
              />
              <FormControlLabel
                value="Texte"
                control={<Radio />}
                label="Load texte file"
                disabled={configImport.typeOfFileToDisable.Texte}
                checked={configImport.typeOfFileToLoad === "Texte"}
              />
            </RadioGroup>
          </FormControl>
        )}
      </th>
    </tr>
  )
}
export default setting
