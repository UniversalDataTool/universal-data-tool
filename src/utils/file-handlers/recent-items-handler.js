import getSampleNameFromURL from "../get-sample-name-from-url"
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import isEmpty from "../isEmpty"
import { setIn } from "seamless-immutable"
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
    static createOneNewSample(sampleName, url, annotation) {
        var sample
        var type = RecognizeFileExtension(url)
        if (type === "Image") {
            sample={
            annotation: annotation,
            imageUrl: url,
            sampleName: sampleName,
            }
        }
        if (type === "Video") {
            sample={
            annotation: annotation,
            videoUrl: url,
            sampleName: sampleName,
            }
        }
        if (type === "Audio") {
            sample={
            annotation: annotation,
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
                nameToSearch[1] === sampleName
              ) {
                return samples[i]
              }
            }
          }
        }
        return null
    }
    static setSamplesName(samples){
      if (!isEmpty(samples)) {
        for (var i = 0; i < samples.length; i++) {
          if (!isEmpty(samples[i])) {
            var oldsample = samples[i]
            var sampleName = getSampleNameFromURL(oldsample)
            var boolName = true
            var v = 1
            while (boolName) {
              var sampletocompare1 = this.getSampleWithThisSampleName(sampleName[1], samples)
              if (sampletocompare1 !== null && this.getSampleUrl(sampletocompare1)!== this.getSampleUrl(oldsample)) {
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
                oldsample= setIn(oldsample,["sampleName"],sampleName[1])
                samples= setIn(samples,[i],oldsample)
                boolName = false
              }
            }
          }
        }
      }
      return samples
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
    static eraseAnnotation(samples){
      var Tabsamples = []
      for (let i = 0; i < samples.length; i++) {
        let Newsample = samples[i]
        if (!isEmpty(Newsample.annotation)) {
          Newsample = setIn(Newsample, ["annotation"], null)
        }
        Tabsamples.push(Newsample)
      }
      return Tabsamples
    }

    static concatSample(actualSamples, newSamples, annotationToKeep) {
      var Tabsamples = actualSamples
      if (annotationToKeep === "incoming") {
        Tabsamples = this.eraseAnnotation(actualSamples)
      }

      var Tabsamples2 = newSamples
      if (annotationToKeep === "current") {
        Tabsamples2 = this.eraseAnnotation(newSamples)
      }
      var concatSamples=Tabsamples.concat(Tabsamples2)
      return concatSamples
    }
}
  
  export default LocalStorageHandler
  