import uploadFileToTransferSh from './upload-file-to-transfersh'
import splitFileNameFromFileURL from './split-file-name-from-file-url'
import { setIn } from "seamless-immutable";

// TODO move to utils directory
const idify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")

const getFileURLKey = (item) => {
    if (item.imageUrl) return "imageUrl"
    if (item.videoUrl) return "videoUrl"
    if (item.audioUrl) return "audioUrl"
    return null
}

const transformFileURLsToWebURLs = async({ oha, onChangeOHA, setProgress, remote }) => {
    const newTaskData = []

    //const fileURLsArray = putFileURLsToAnArray(oha.taskData)

    // const filesCount = fileURLsArray.length
    const progressUnit = 100 / oha.taskData.length
    for (let taskDataIndex = 0; taskDataIndex < oha.taskData.length; taskDataIndex++) {
        const taskDataItem = oha.taskData[taskDataIndex]
        
        const fileURLKey = getFileURLKey(taskDataItem)
        
        if (!fileURLKey) {
            newTaskData.push(taskDataItem)
            continue
        }
        
        const fileURL = taskDataItem[fileURLKey]
        
        if (!fileURL.startsWith("file://")) {
            newTaskData.push(taskDataItem)
            continue
        }
        
        
        const halfProgressOfUnit = progressUnit * taskDataIndex
        setProgress(halfProgressOfUnit)
        
        const fileName = idify(splitFileNameFromFileURL(fileURL))
        
        const webURLOfUploadedFile = await uploadFileToTransferSh({ fileName, fileURL, remote })
            .catch(e => (console.warn(e), null))
        
        if (!webURLOfUploadedFile) {
            newTaskData.push(taskDataItem)
            continue
        }
        
        newTaskData.push({
            ...taskDataItem,
            [fileURLKey]: webURLOfUploadedFile
        })
        
        
        // const indexOfFileURL = (fileURLsArray.indexOf(fileURL)) + 1
        // const webURLOfUploadedFile = await uploadFileToTransferSh({ fileName, fileURL, remote })
        // const newOhaItem = { videoUrl: webURLOfUploadedFile } //TODO: change this with real ohaItem
        // newTaskData.push(newOhaItem)
        // const fullProgressOfUnit = progressUnit * indexOfFileURL
        // setProgress(fullProgressOfUnit)
    }
    setProgress(100)
    onChangeOHA(setIn(oha, ["taskData"], newTaskData));
}

export default transformFileURLsToWebURLs