export default (s, opts = {}) => {
  let extension = s.replace(/\?.*/g, "").split(".").slice(-1)[0]
  if (s.includes("gstatic.com/images")) {
    extension = "jpg"
  }
  switch (extension.toLowerCase()) {
    case "png":
    case "jpg":
    case "gif":
    case "jpeg":
    case "bmp": {
      return { imageUrl: s }
    }
    case "pdf": {
      return { pdfUrl: s }
    }
    case "mp3":
    case "wav": {
      return { audioUrl: s }
    }
    default: {
      if (opts.returnNulls) return null
      throw new Error(`extension not recognized: "${extension}" in "${s}"`)
      // TODO if the user doesn't care, return null (this
      // behavior could be enabled with textfield option)
    }
  }
}
