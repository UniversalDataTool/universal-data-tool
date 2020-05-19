import uploadFileToTransferSh from "./upload-file-to-transfersh"
import splitFileNameFromFileURL from "./split-file-name-from-file-url"
import getFileURLKey from "./get-file-url-key"
import { setIn } from "seamless-immutable"

// TODO move to utils directory
const idify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")

const transformFileURLsToWebURLs = async ({
  dataset,
  onChangeDataset,
  setProgress,
  remote,
}) => {
  const newsamples = []

  const progressUnit = 100 / dataset.samples.length
  for (
    let samplesIndex = 0;
    samplesIndex < dataset.samples.length;
    samplesIndex++
  ) {
    const samplesItem = dataset.samples[samplesIndex]

    const fileURLKey = getFileURLKey(samplesItem)

    if (!fileURLKey) {
      newsamples.push(samplesItem)
      continue
    }

    const fileURL = samplesItem[fileURLKey]

    if (!fileURL.startsWith("file://")) {
      newsamples.push(samplesItem)
      continue
    }

    const halfProgressOfUnit = progressUnit * samplesIndex
    setProgress(halfProgressOfUnit)

    const fileName = idify(splitFileNameFromFileURL(fileURL))

    const webURLOfUploadedFile = await uploadFileToTransferSh({
      fileName,
      fileURL,
      remote,
    }).catch((e) => console.warn(e))

    if (!webURLOfUploadedFile) {
      newsamples.push(samplesItem)
      continue
    }

    newsamples.push({
      ...samplesItem,
      [fileURLKey]: webURLOfUploadedFile,
    })
  }
  setProgress(100)
  onChangeDataset(setIn(dataset, ["samples"], newsamples))
}

export default transformFileURLsToWebURLs
