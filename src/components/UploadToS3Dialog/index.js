import React, { useState, useEffect, useRef } from "react"
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import SimpleDialog from "../SimpleDialog"
import S3PathSelector from "../S3PathSelector"
import getSampleFromUrl from "../PasteUrlsDialog/get-sample-from-url.js"
import IconButton from "@material-ui/core/IconButton"
import BackIcon from "@material-ui/icons/KeyboardArrowLeft"
// import { useAppConfig } from "../AppConfig"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import useIAMS3API from "../../utils/auth-handlers/use-iam-s3-api"
import MultiFileDrop from "../MultiFileDrop"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"

const SelectedPath = styled("div")({
  fontSize: 14,
  color: colors.grey[700],
  fontWeight: "bold",
})

export const UploadToS3Dialog = ({ open, onClose, onAddSamples }) => {
  const {
    listBuckets,
    listBucketItemsAt,
    putBucketItem,
    parseS3URI,
  } = useIAMS3API()
  const [complete, setComplete] = useState(false)
  const uploadedPaths = useRef([])
  const [s3Path, setS3Path] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [{ options, optionsLoading }, setOptions] = useState({
    optionsLoading: true,
  })
  useEffect(() => {
    if (!listBuckets) return
    if (!open) return
    async function loadS3Path() {
      if (s3Path === "") {
        setOptions({
          optionsLoading: false,
          options: (
            await listBuckets()
          ).ListAllMyBucketsResult.Buckets.Bucket.map((b) => ({
            name: b.Name,
            type: "bucket",
          })),
        })
      } else {
        setOptions({
          optionsLoading: false,
          options: (
            (await listBucketItemsAt(s3Path)).ListBucketResult.CommonPrefixes ||
            []
          ).map((a) => ({
            name: a.Prefix.split("/").slice(-2).join("/"),
            type: "directory",
          })),
        })
      }
    }
    loadS3Path()
    // eslint-disable-next-line
  }, [open, s3Path, listBuckets, listBucketItemsAt])
  if (!open) return null
  return (
    <SimpleDialog
      onClose={onClose}
      open={open}
      title="Upload to S3"
      actions={[
        activeStep === 0 && {
          onClick: () => setActiveStep(1),
          disabled: !s3Path,
          text: "Upload to this directory",
        },
        activeStep === 1 && {
          disabled: !complete,
          onClick: () => {
            const samples = uploadedPaths.current
              .map((url) => getSampleFromUrl(url, { returnNulls: true }))
              .filter(Boolean)
            onAddSamples(samples)
          },
          text: "Add Samples",
        },
      ].filter(Boolean)}
    >
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Directory to Upload To</StepLabel>
        </Step>
        <Step>
          <StepLabel>Upload Files</StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <>
          {optionsLoading ? (
            <Box height={300} width={400} paddingTop={4} textAlign="center">
              <CircularProgress size={100} />
            </Box>
          ) : (
            <S3PathSelector
              currentPath={s3Path}
              canCreateNew
              options={options || []}
              onChangePath={(newS3Path) => {
                setS3Path(newS3Path)
                setOptions({ optionsLoading: true })
              }}
            />
          )}
        </>
      )}
      {activeStep === 1 && (
        <>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => setActiveStep(0)}>
              <BackIcon />
            </IconButton>
            <SelectedPath>Uploading to: {s3Path}</SelectedPath>
          </Box>
          <Box>
            <MultiFileDrop
              loadFile={async (file) => {
                const filePath = s3Path + file.name
                await putBucketItem(filePath, file)
                const { bucket, path } = parseS3URI(filePath)
                uploadedPaths.current.push(
                  `https://s3.amazonaws.com/${bucket}/${path}`
                )
              }}
              onComplete={() => {
                setComplete(true)
              }}
            />
          </Box>
        </>
      )}
    </SimpleDialog>
  )
}

export default UploadToS3Dialog
