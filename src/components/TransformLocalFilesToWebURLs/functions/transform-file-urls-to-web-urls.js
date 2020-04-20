import uploadFileToTransferSh from './upload-file-to-trasfersh'
import splitFileNameFromFileURL from './split-file-name-from-file-url'
import putFileURLsToAnArray from './put-file-urls-to-an-array'
import { setIn } from "seamless-immutable";

const tranfomFileURLsToWebURLs = async({ oha, onChangeOHA, setProgress, remote }) => {
    const newOhaFromUploadedFiles = []

    const fileURLsArray = putFileURLsToAnArray(oha.taskData)

    const filesCount = fileURLsArray.length
    const progressUnit = 100 / filesCount
    for (const fileURL of fileURLsArray) {
        const indexOfFileURL = (fileURLsArray.indexOf(fileURL)) + 1
        const halfProgressOfUnit = (progressUnit / 2) * indexOfFileURL
        setProgress(halfProgressOfUnit)
        const fileName = splitFileNameFromFileURL(fileURL)
        const webURLOfUploadedFile = await uploadFileToTransferSh({ fileName, fileURL, remote })
        const newOhaItem = { videoUrl: webURLOfUploadedFile } //TODO: change this with real ohaItem
        newOhaFromUploadedFiles.push(newOhaItem)
        const fullProgressOfUnit = progressUnit * indexOfFileURL
        setProgress(fullProgressOfUnit)
    }
    onChangeOHA(setIn(oha, ["taskData"], newOhaFromUploadedFiles));
}

export default tranfomFileURLsToWebURLs