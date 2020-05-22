import RecognizeFileExtension from "../RecognizeFileExtension"
export default (sampleName, url, annotation) => {
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
