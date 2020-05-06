import getSampleNameFromURL from "../get-sample-name-from-url"
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import isEmpty from "../isEmpty"
import extendWithNull from "../extend-with-null"
class LocalStorageHandler {
    static getSampleName(sample) {
        var sampleName
        if (!isEmpty(sample.sampleName)) {
            sampleName=sample.sampleName
        } else {
            sampleName=getSampleNameFromURL(sample)[1]
        } 
        return sampleName
    }
    static getSampleUrl(sample){
        var url
        if (!isEmpty(sample.imageUrl)) {
        url = sample.imageUrl
        }
        if (!isEmpty(sample.videoUrl)) {
        url = sample.videoUrl
        }
        if (!isEmpty(sample.audioUrl)) {
        url = sample.audioUrl
        }
        
        return url
    }
    static createOneNewSample(sampleName, url) {
        var sample
        var type = RecognizeFileExtension(url)
        if (type === "Image") {
            sample={
            imageUrl: url,
            sampleName: sampleName,
            }
        }
        if (type === "Video") {
            sample={
            videoUrl: url,
            sampleName: sampleName,
            }
        }
        if (type === "Audio") {
            sample={
            audioUrl: url,
            sampleName: sampleName,
            }
        }
        return sample
    }
    static getSampleWithThisSampleName(sampleName, samples) {
        var nameToSearch
        if (!isEmpty(samples)) {
          for (var i = 0; i < samples.length; i++) {
            if (!isEmpty(samples[i])) {
              nameToSearch = getSampleNameFromURL(samples[i])
              if (typeof samples[i].sampleName !== "undefined") {
                nameToSearch[1] = samples[i].sampleName
              }
              if (
                nameToSearch[0] !== sampleName[0] &&
                nameToSearch[1] === sampleName[1]
              ) {
                return samples[i]
              }
            }
          }
        }
        return null
    }
    static setSamplesName(newSamples,oldSamples){
        if (!isEmpty(newSamples)) {
            for (var i = 0; i < newSamples.length; i++) {
              if (!isEmpty(newSamples[i])) {
                var sampleName = getSampleNameFromURL(newSamples[i])
                var boolName = true
                var v = 1
                while (boolName) {
                  if (
                    this.getSampleWithThisSampleName(sampleName, oldSamples) !== null||
                    this.getSampleWithThisSampleName(sampleName, newSamples)!== null
                  ) {
                    if (isEmpty(sampleName[2].match("(.*)\\([0-9]*\\)$"))) {
                      sampleName[1] =
                        sampleName[2] + "(" + v.toString() + ")." + sampleName[3]
                    } else {
                      sampleName[1] =
                        sampleName[2].match("(.*)\\([0-9]*\\)$")[1] +
                        "(" +
                        v.toString() +
                        ")" +
                        +"." +
                        sampleName[3]
                    }
                    v++
                  } else {
                    newSamples[i].sampleName = sampleName[1]
                    boolName = false
                  }
                }
                newSamples[i].sampleName = sampleName[1]
              }
            }
          }
          return newSamples
    }
    static projectHasDataFile(typeProject){
        if ("text_entity_recognition" === typeProject || "text_classification" === typeProject)
        return "none"
        if (
            "video_segmentation" === typeProject ||
            "image_classification" === typeProject ||
            "image_segmentation" === typeProject ||
            "audio_transcription" === typeProject
        )
        return "file"
        return ""
    }
    static concatSampleOutput(oldOHA, appendedTaskOutput, annotationToKeep) {
        var taskOutput = []
        if (
          !isEmpty(annotationToKeep)
        ) {
          if (annotationToKeep === "incoming") {
            if (appendedTaskOutput) {
              taskOutput = extendWithNull([], oldOHA.taskData.length|| 0).concat(
                appendedTaskOutput
              )
            }
            return taskOutput
          }
          if (annotationToKeep === "current") {
            if (appendedTaskOutput) {
              taskOutput = extendWithNull(oldOHA.taskOutput || [], oldOHA.taskData.length|| 0)
            }
            return taskOutput
          }
        }
        if (appendedTaskOutput) {
            taskOutput = extendWithNull(
                oldOHA.taskOutput || [],
                oldOHA.taskData.length || 0
            ).concat(appendedTaskOutput)
        }
        
        return taskOutput
      }
}
  
  export default LocalStorageHandler
  