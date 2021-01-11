import React from "react"
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
} from "@material-ui/core/"
const setting = ({ configImport, setConfigImport, tableStyle }) => {
  return (
    <Grid container item xs={12} spacing={0} justify="center">
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
              value="Text"
              control={<Radio />}
              label="Load text file"
              disabled={configImport.typeOfFileToDisable.Text}
              checked={configImport.typeOfFileToLoad === "Text"}
            />
            <FormControlLabel
              value="Time"
              control={<Radio />}
              label="Load time file"
              disabled={configImport.typeOfFileToDisable.Time}
              checked={configImport.typeOfFileToLoad === "Time"}
            />
          </RadioGroup>
        </FormControl>
      )}
    </Grid>
  )
}
export default setting
