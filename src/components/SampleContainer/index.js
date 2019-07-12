import React from "react"
import { makeStyles } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import ReactMarkdown from "react-markdown"

const useStyles = makeStyles({
  header: {
    display: "flex",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderBottom: "1px solid #ccc",
    alignItems: "center"
  },
  title: {
    fontWeight: "bold"
  },
  buttons: {
    "& > *": {
      margin: 4
    }
  },
  description: {
    padding: 10,
    "& img": {
      maxWidth: "calc(100% - 200px)",
      maxHeight: 600
    }
  },
  content: {
    padding: 10
  }
})

export const SampleContainer = ({
  hideHeader = false,
  hideDescription = false,
  currentSampleIndex,
  totalSamples,
  onChangeSample,
  description,
  children
}) => {
  const c = useStyles()
  return (
    <Grid container>
      {!hideHeader && (
        <Grid xs={12}>
          <div className={c.header}>
            <div className={c.title}>
              Sample {currentSampleIndex + 1} / {totalSamples}
            </div>
            <div style={{ flexGrow: 1 }} />
            <div className={c.buttons}>
              <Button
                onClick={() =>
                  onChangeSample(
                    (currentSampleIndex - 1 + totalSamples) % totalSamples
                  )
                }
                variant="outlined"
              >
                Prev
              </Button>
              <Button
                onClick={() =>
                  onChangeSample((currentSampleIndex + 1) % totalSamples)
                }
                variant="outlined"
              >
                Next
              </Button>
            </div>
          </div>
        </Grid>
      )}
      {!hideDescription && (
        <Grid xs={12} sm={12} md={6}>
          <div className={c.description}>
            <ReactMarkdown escapeHtml={false} source={description} />
          </div>
        </Grid>
      )}
      <Grid xs={12} sm={12} md={hideDescription ? 12 : 6}>
        <div className={c.content}>{children}</div>
      </Grid>
    </Grid>
  )
}

export default SampleContainer
