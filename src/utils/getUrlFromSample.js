export default (sample) => {
    
    var url
    if (typeof sample.imageUrl !== "undefined") {
      url = sample.imageUrl
    }
    if (typeof sample.videoUrl !== "undefined") {
      url = sample.videoUrl
    }
    if (typeof sample.audioUrl !== "undefined") {
      url = sample.audioUrl
    }
    return url
  }