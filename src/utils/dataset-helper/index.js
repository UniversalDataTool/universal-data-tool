// @flow weak

import getSampleNameFromURL from "../get-sample-name-from-url"
import RecognizeFileExtension from "../RecognizeFileExtension"
import isEmpty from "lodash/isEmpty"
import { setIn } from "seamless-immutable"
import getFilesDifferencesImport from "./get-files-differences.js"

export const getFilesDifferences = getFilesDifferencesImport

export const getSampleName = (sample) => {
  var sampleName
  if (!isEmpty(sample.sampleName)) {
    sampleName = sample.sampleName
  } else {
    sampleName = getSampleNameFromURL(sample)[1]
  }
  return sampleName
}

export const getSampleUrl = (sample) => {
  return (
    sample.imageUrl ||
    sample.videoUrl ||
    sample.audioUrl ||
    sample.pdfUrl ||
    undefined
  )
}

export const constructSample = (sampleName, url, annotation) => {
  var type = RecognizeFileExtension(url)
  if (type === "Image") {
    return {
      annotation: annotation,
      imageUrl: url,
      sampleName: sampleName,
    }
  }
  if (type === "Video") {
    return {
      annotation: annotation,
      videoUrl: url,
      sampleName: sampleName,
    }
  }
  if (type === "Audio") {
    return {
      annotation: annotation,
      audioUrl: url,
      sampleName: sampleName,
    }
  }
  if (type === "PDF") {
    return {
      annotation: annotation,
      pdfUrl: url,
      sampleName: sampleName,
    }
  }
}
export const createOneNewSample = constructSample

export const getSampleWithName = (dataset, sampleName) => {
  if (!dataset || !dataset.samples || !sampleName) return null
  const { samples } = dataset
  for (var i = 0; i < samples.length; i++) {
    if (!isEmpty(samples[i])) {
      const nameToSearch = getSampleNameFromURL(samples[i])
      if (typeof samples[i].sampleName !== "undefined") {
        nameToSearch[1] = samples[i].sampleName
      }
      if (nameToSearch[1] === sampleName) {
        return samples[i]
      }
    }
  }
  return null
}
export const getSampleWithThisSampleName = getSampleWithName

export const addNamesToSamples = (dataset) => {
  if (!dataset || !dataset.samples) return
  for (var i = 0; i < dataset.samples.length; i++) {
    if (isEmpty(dataset.samples[i])) continue
    var oldsample = dataset.samples[i]
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
      sampleName = getSampleNameFromURL(oldsample)
      sampleName = renameSampleFromUrl(dataset.samples, oldsample, sampleName)
    }
    oldsample = setIn(oldsample, ["sampleName"], sampleName[1])
    dataset = setIn(dataset, ["samples", i], oldsample)
  }
  return dataset
}
export const setSamplesName = addNamesToSamples

export const renameSampleFromUrl = (samples, sampleToChange, sampleName) => {
  var boolName = true
  var v = 1
  while (boolName) {
    var sampletocompare1 = getSampleWithThisSampleName(sampleName[1], samples)
    if (
      sampletocompare1 !== null &&
      getSampleUrl(sampletocompare1) !== getSampleUrl(sampleToChange)
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
      boolName = false
    }
  }
  return sampleName
}

export const eraseAnnotation = (samples) => {
  var samplesWithoutAnnotation = []
  for (let i = 0; i < samples.length; i++) {
    let Newsample = samples[i]
    if (!isEmpty(Newsample.annotation)) {
      Newsample = setIn(Newsample, ["annotation"], null)
    }
    samplesWithoutAnnotation.push(Newsample)
  }
  return samplesWithoutAnnotation
}

export const concatSample = (actualSamples, newSamples, annotationToKeep) => {
  var Tabsamples = actualSamples
  if (annotationToKeep === "incoming") {
    Tabsamples = eraseAnnotation(actualSamples)
  }

  var Tabsamples2 = newSamples
  if (annotationToKeep === "current") {
    Tabsamples2 = eraseAnnotation(newSamples)
  }
  var concatSamples = Tabsamples.concat(Tabsamples2)
  return concatSamples
}

export const getFileDifferences = (objectOfRef, objectToCheck) => {
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

export const fileHasChanged = getFileDifferences
