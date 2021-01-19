import importFromAnnotation from "../import-from-aws-annotations.spec"
import importFromAssets from "../import-from-aws-assets.spec"

const test = () => {
  it("Try to import a project from annotations(Image)", () => {
    importFromAnnotation("Image Classification", "Image Classification", 2, 3)
  })
  it("Try to import a project from annotations(Video)", () => {
    importFromAnnotation("Video Segmentation", "Video Segmentation", 1, 8)
  })
  it("Try to import a project from annotations(Audio)", () => {
    importFromAnnotation("Audio Transcription", "Audio Transcription", 1, 0)
  })
  it("Try to import a project from annotations(PDF)", () => {
    importFromAnnotation("Data Entry", "Data Entry", 2, 1)
  })
  it("Try to import a project from annotations(Text)", () => {
    importFromAnnotation("Text Classification", "Text Classification", 3, 5)
  })
  it("Try to import a project from annotations(Time:DataTime)", () => {
    importFromAnnotation("Time Series 2", "Time Series", 1, 6)
  })
  it("Try to import a project from annotations(Time:AudioUrl)", () => {
    importFromAnnotation("Time Series", "Time Series", 1, 7)
  })

  it("Try to import a project from assets(Image)", () => {
    importFromAssets("Image Classification", "Image Classification", 2, 3)
  })
  it("Try to import a project from assets(Audio)", () => {
    importFromAssets("Audio Transcription", "Audio Transcription", 1, 0)
  })
  it("Try to import a project from assets(Video)", () => {
    importFromAssets("Video Segmentation", "Video Segmentation", 1, 7)
  })
  it("Try to import a project from assets(PDF)", () => {
    importFromAssets("Data Entry", "Data Entry", 2, 1)
  })
  it("Try to import a project from assets(Text)", () => {
    importFromAssets("Text Classification", "Text Classification", 3, 5)
  })
  it("Try to import a project from assets(Time:DataTime)", () => {
    importFromAssets("Time Series 2", "Time Series", 1, 6)
  })
  it("Try to import a project from assets(Time:AudioUrl)", () => {
    importFromAssets("Time Series", "Time Series", 1, 7)
  })
}
export default test
