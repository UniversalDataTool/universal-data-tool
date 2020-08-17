import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import SimpleDialog from "../SimpleDialog"
import S3PathSelector from "../S3PathSelector"
import getSampleFromUrl from "../PasteUrlsDialog/get-sample-from-url.js"
// import { useAppConfig } from "../AppConfig"
import useIAMS3API from "../../utils/auth-handlers/use-iam-s3-api"

export const ImportFromS3Dialog = ({ open, onClose, onAddSamples }) => {
  const { listBuckets, listBucketItemsAt } = useIAMS3API()
  const [s3Path, setS3Path] = useState("")
  const [{ options, optionsLoading }, setOptions] = useState({
    optionsLoading: true,
  })
  useEffect(() => {
    if (!open) return
    if (!listBuckets) return
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
  }, [s3Path, listBuckets, listBucketItemsAt, open])
  if (!open) return null
  return (
    <SimpleDialog
      onClose={onClose}
      open={open}
      title="Import from S3"
      actions={[
        {
          onClick: async () => {
            const bucket = s3Path.match(/s3:\/\/([^/]+)/)[1]

            // TODO support more than 1000 file import by using
            // continuation-token on S3
            const items = (
              await listBucketItemsAt(s3Path, { files: true })
            ).ListBucketResult.Contents.filter(
              (item) => !item.Key.endsWith("/")
            )
              .map((item) => `https://s3.amazonaws.com/${bucket}/${item.Key}`)
              .map((url) => getSampleFromUrl(url, { returnNulls: true }))
              .filter(Boolean)
            onAddSamples(items)
          },
          disabled: !s3Path,
          text: "Import All Files in Directory",
        },
      ]}
    >
      {optionsLoading ? (
        <Box height={300} width={400} paddingTop={4} textAlign="center">
          <CircularProgress size={100} />
        </Box>
      ) : (
        <S3PathSelector
          currentPath={s3Path}
          options={options || []}
          onChangePath={(newS3Path) => {
            setS3Path(newS3Path)
            setOptions({ optionsLoading: true })
          }}
        />
      )}
    </SimpleDialog>
  )
}

export default ImportFromS3Dialog
