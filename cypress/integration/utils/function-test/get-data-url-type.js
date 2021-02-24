import getDataUrlType from "../../../dist/utils/get-data-url-type"
const getDataUrlTypeTest = () => {
  it("Check getDataUrlType", () => {
    expect(
      getDataUrlType(
        "https://s3.amazonaws.com/asset.workaround.online/example-jobs/sticky-notes/image2.jpg"
      )
    ).to.equal("Image")
    expect(
      getDataUrlType(
        "https://s3.amazonaws.com/asset.workaround.online/SampleVideo_1280x720_1mb.mp4"
      )
    ).to.equal("Video")
    expect(
      getDataUrlType("https://html5tutorial.info/media/vincent.mp3")
    ).to.equal("Audio")
    expect(getDataUrlType("https://arxiv.org/pdf/1908.07069.pdf")).to.equal(
      "PDF"
    )
    expect(getDataUrlType("https://arxiv.org/pdf/1908.07069.txt")).to.equal(
      "Text"
    )
    expect(getDataUrlType("https://arxiv.org/pdf/1908.07069.js")).to.equal(
      "File"
    )
  })
}
export default getDataUrlTypeTest
