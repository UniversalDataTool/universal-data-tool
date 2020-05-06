import getSampleNameFromURL from "../get-sample-name-from-url"
import RecognizeFileExtension from "../../utils/RecognizeFileExtension"
import isEmpty from "../../utils/isEmpty"
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
    static setSampleName(sample,sampleName){
        return sample
    }
}
  
  export default LocalStorageHandler
  