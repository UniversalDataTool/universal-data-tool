import React from "react"
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
} from "@material-ui/core/"
import { useTranslation } from "react-i18next"
export default ({ configImport, setConfigImport }) => {
  const { t } = useTranslation()
  return (
    <Grid container item xs={12} spacing={0} justify="center">
      {!configImport.loadAssetsIsSelected ? (
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("annotation-processing")}</FormLabel>
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
              label={t("keep-both-annotations")}
              checked={configImport.annotationToKeep === "both"}
            />
            <FormControlLabel
              value="incoming"
              control={<Radio />}
              label={t("keep-incoming-annotations")}
              checked={configImport.annotationToKeep === "incoming"}
            />
            <FormControlLabel
              value="current"
              control={<Radio />}
              label={t("keep-current-annotations")}
              checked={configImport.annotationToKeep === "current"}
            />
          </RadioGroup>
        </FormControl>
      ) : (
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("choose-file-type")}</FormLabel>
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
              label={t("load-image-file")}
              disabled={configImport.typeOfFileToDisable.Image}
              checked={configImport.typeOfFileToLoad === "Image"}
            />
            <FormControlLabel
              value="Video"
              control={<Radio />}
              label={t("load-video-file")}
              disabled={configImport.typeOfFileToDisable.Video}
              checked={configImport.typeOfFileToLoad === "Video"}
            />
            <FormControlLabel
              value="Audio"
              control={<Radio />}
              label={t("load-audio-file")}
              disabled={configImport.typeOfFileToDisable.Audio}
              checked={configImport.typeOfFileToLoad === "Audio"}
            />
            <FormControlLabel
              value="PDF"
              control={<Radio />}
              label={t("load-pdf-file")}
              disabled={configImport.typeOfFileToDisable.PDF}
              checked={configImport.typeOfFileToLoad === "PDF"}
            />
            <FormControlLabel
              value="Text"
              control={<Radio />}
              label={t("load-text-file")}
              disabled={configImport.typeOfFileToDisable.Text}
              checked={configImport.typeOfFileToLoad === "Text"}
            />
          </RadioGroup>
        </FormControl>
      )}
    </Grid>
  )
}
