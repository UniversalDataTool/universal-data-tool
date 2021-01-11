import React from "react"
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@material-ui/core"
const settingDialog = ({ configExport, setConfigExport }) => {
  return (
    <Grid container spacing={0}>
      <Grid container item xs={12} spacing={1} justify="center" direction="row">
        <Grid xs={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Assets processing</FormLabel>
            <RadioGroup
              aria-label="option1"
              onChange={(event) => {
                setConfigExport({
                  ...configExport,
                  typeAssetExport: event.target.value,
                })
              }}
            >
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="Don't upload assets"
                checked={configExport.typeAssetExport === "none"}
              />
              <FormControlLabel
                value="withProxy"
                control={<Radio />}
                label="Use a proxy"
                checked={configExport.typeAssetExport === "withProxy"}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid container item xs={6} spacing={1} direction="column">
          <FormLabel>Proxy url</FormLabel>
          <TextField
            id="proxy"
            onChange={(event) => {
              setConfigExport({
                ...configExport,
                proxyUrl: event.target.value,
              })
            }}
            onFocus={(event) => {
              event.target.select()
            }}
            value={configExport.proxyUrl}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default settingDialog
