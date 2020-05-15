import getSampleNameFromURL from "../get-sample-name-from-url"
import RecognizeFileExtension from "../RecognizeFileExtension"
import isEmpty from "../isEmpty"
import { setIn } from "seamless-immutable"
class LocalStorageHandler {
  static async getTextFromUrl(urlSource) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/"
    var response
    var url
    url = proxyUrl + urlSource
    response = await fetch(url, {
      method: "GET",
    }).catch((error) => {
      console.log("Looks like there was a problem: \n", error)
    })
    const text = await response.text()
    return text
  }
  
  static async getTextfromSample(sample){
   var text = ""
   if (isEmpty(sample.document)){
      if(!isEmpty(sample.textUrl)){
        text = await this.getTextFromUrl(sample.textUrl)
      }
   }else{
     text = sample.document
   }
   return text
  }
  
  static getSampleName(sample,indexSample) {
    var sampleName
    sampleName = getSampleNameFromURL(sample)
    if(isEmpty(sampleName))
      sampleName = [
        sample.document,
        "sample" + indexSample.toString() + ".txt",
        "sample",
        "txt",
      ]
    if (!isEmpty(sample.sampleName))
      sampleName = setIn(sampleName,[1],sample.sampleName)
    return sampleName
  }
  static getSampleUrl(sample) {
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
    if (!isEmpty(sample.pdfUrl)) {
      url = sample.pdfUrl
    }
    if (!isEmpty(sample.textUrl)) {
      url = sample.textUrl
    }

    return url
  }
  static createOneNewSample(sampleName, url, annotation) {
    var sample
    var type = RecognizeFileExtension(url)
    if (type === "Image") {
      sample = {
        annotation: annotation,
        imageUrl: url,
        sampleName: sampleName,
      }
    }
    if (type === "Video") {
      sample = {
        annotation: annotation,
        videoUrl: url,
        sampleName: sampleName,
      }
    }
    if (type === "Audio") {
      sample = {
        annotation: annotation,
        audioUrl: url,
        sampleName: sampleName,
      }
    }
    if (type === "PDF") {
      sample = {
        annotation: annotation,
        pdfUrl: url,
        sampleName: sampleName,
      }
    }
    return sample
  }
  static getSampleWithThisSampleName(sampleName, samples) {
    var nameToSearch
    if (!isEmpty(samples) && !isEmpty(sampleName)) {
      for (var i = 0; i < samples.length; i++) {
        if (!isEmpty(samples[i])) {
          nameToSearch = this.getSampleName(samples[i],i)
          if (!isEmpty(samples[i].sampleName)) {
            nameToSearch = setIn(nameToSearch,[1],samples[i].sampleName)
          }
          if (nameToSearch[1] === sampleName) {
            return samples[i]
          }
          
        }
      }
    }
    return null
  }
  static setSamplesName(samples) {
    if (!isEmpty(samples)) {
      for (var i = 0; i < samples.length; i++) {
        if (!isEmpty(samples[i])) {
          var oldsample = samples[i]
          var sampleName
          if (!isEmpty(oldsample.document)) {
            // Deal with the exception of the text file (they don't have url)
            sampleName = [
              oldsample.document,
              "sample" + i.toString() + ".txt",
              "sample",
              "txt",
            ]
          } else {
            sampleName = this.getSampleName(oldsample,i)
            sampleName = this.renameSampleFromUrl(
              samples,
              oldsample,
              sampleName
            )
          }
          oldsample = setIn(oldsample, ["sampleName"], sampleName[1])
          samples = setIn(samples, [i], oldsample)
        }
      }
    }
    return samples
  }
  static renameSampleFromUrl(samples, sampleToChange, sampleName) {
    var boolName = true
    var v = 1
    while (boolName) {
      var sampletocompare1 = this.getSampleWithThisSampleName(
        sampleName[1],
        samples
      )
      if (
        sampletocompare1 !== null &&
        this.getSampleUrl(sampletocompare1) !==
          this.getSampleUrl(sampleToChange)
      ) {
        if (isEmpty(sampleName[2].match("(.*)\\([0-9]*\\)$"))) {
          sampleName= setIn(sampleName,[1],
            sampleName[2] + "(" + v.toString() + ")." + sampleName[3])
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
        boolName = false
      }
    }
    return sampleName
  }
  static projectHasDataFile(typeProject) {
    if (
      "text_entity_recognition" === typeProject ||
      "text_classification" === typeProject
    )
      return "none"
    if (
      "video_segmentation" === typeProject ||
      "image_classification" === typeProject ||
      "image_segmentation" === typeProject ||
      "audio_transcription" === typeProject ||
      "composite" === typeProject ||
      "data_entry" === typeProject
    )
      return "file"
    return ""
  }
  static eraseAnnotation(samples) {
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

    var Tabsamples2 = newSamples
    if (annotationToKeep === "dontKeepAnnotation") {
      Tabsamples2 = this.eraseAnnotation(newSamples)
    }
    var concatSamples = Tabsamples.concat(Tabsamples2)
    return concatSamples
  }

  static fileHasChanged(objectOfRef, objectToCheck) {
    // This class return every change in one item of recentItems and its location
    var resultSet = {
      fileName: false,
      content: {
        interface: {
          type: false,
          labels: false,
          regionTypesAllowed: false,
        },
        samples: false,
      },
      id: false,
      mode: false,
      any: false,
    }
    // Check if the object to check exist if not return false
    if (isEmpty(objectToCheck)) return resultSet

    // Check if the object of reference exist if not return true
    if (isEmpty(objectOfRef)) {
      resultSet.fileName = true
      resultSet.content.interface.type = true
      resultSet.content.interface.labels = true
      resultSet.content.interface.regionTypesAllowed = true
      resultSet.content.samples = true
      resultSet.id = true
      resultSet.mode = true
      resultSet.any = true
      return resultSet
    }

    if (objectOfRef !== objectToCheck) {
      resultSet.any = true
    } else {
      return resultSet
    }

    // Check if the id doesn't exist or have change
    if (!isEmpty(objectToCheck.id)) {
      if (isEmpty(objectOfRef.id)) resultSet.id = true
      else if (objectToCheck.id !== objectOfRef.id) resultSet.id = true
    }

    // Check if the content doesn't exist or have change
    if (!isEmpty(objectToCheck.content)) {
      if (isEmpty(objectOfRef.content)) {
        resultSet.content.interface.type = true
        resultSet.content.interface.labels = true
        resultSet.content.interface.regionTypesAllowed = true
        resultSet.content.samples = true
      } else if (objectToCheck.content !== objectOfRef.content) {
        //Check if the interface doesn't exist or have change
        if (!isEmpty(objectToCheck.content.interface)) {
          if (isEmpty(objectOfRef.content.interface)) {
            resultSet.content.interface.type = true
            resultSet.content.interface.labels = true
            resultSet.content.interface.regionTypesAllowed = true
          } else if (
            objectToCheck.content.interface !== objectOfRef.content.interface
          ) {
            //Check if the type doesn't exist or have change
            if (!isEmpty(objectToCheck.content.interface.type)) {
              if (isEmpty(objectOfRef.content.interface.type)) {
                resultSet.content.interface.type = true
              } else if (
                objectToCheck.content.interface.type !==
                objectOfRef.content.interface.type
              ) {
                resultSet.content.interface.type = true
              }
            }
            //Check if the labels doesn't exist or have change
            if (!isEmpty(objectToCheck.content.interface.labels)) {
              if (isEmpty(objectOfRef.content.interface.labels)) {
                resultSet.content.interface.labels = true
              } else if (
                objectToCheck.content.interface.labels !==
                objectOfRef.content.interface.labels
              ) {
                resultSet.content.interface.labels = true
              }
            }
            //Check if the regionsTypesAllowed doesn't exist or have change
            if (!isEmpty(objectToCheck.content.interface.regionTypesAllowed)) {
              if (isEmpty(objectOfRef.content.interface.regionTypesAllowed)) {
                resultSet.content.interface.regionTypesAllowed = true
              } else if (
                objectToCheck.content.interface.regionTypesAllowed !==
                objectOfRef.content.interface.regionTypesAllowed
              ) {
                resultSet.content.interface.regionTypesAllowed = true
              }
            }
          }
        }
        //Check if the samples doesn't exist or have change
        if (!isEmpty(objectToCheck.content.samples)) {
          if (isEmpty(objectOfRef.content.samples)) {
            resultSet.content.samples = true
          } else if (
            objectToCheck.content.samples !== objectOfRef.content.samples
          ) {
            resultSet.content.samples = true
          }
        }
      }
    }

    // Check if the mode doesn't exist or have change
    if (!isEmpty(objectToCheck.mode)) {
      if (isEmpty(objectOfRef.mode)) resultSet.mode = true
      else if (objectToCheck.mode !== objectOfRef.mode) resultSet.mode = true
    }

    // Check if the fileName doesn't exist or have change
    if (!isEmpty(objectToCheck.fileName)) {
      if (isEmpty(objectOfRef.fileName)) resultSet.fileName = true
      else if (objectToCheck.fileName !== objectOfRef.fileName)
        resultSet.fileName = true
    }
    //Default behavior return false
    return resultSet
  }
}

export default LocalStorageHandler
