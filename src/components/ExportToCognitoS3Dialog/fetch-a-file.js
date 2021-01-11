const fetchAFile = async (element, configExport, dm) => {
  var response
  var url
  if (dm.getSampleUrl(element) !== undefined) {
    url = configExport.proxyUrl + dm.getSampleUrl(element)
    response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "xmlhttprequest",
      },
    }).catch((error) => {
      console.log("Looks like there was a problem: \n", error)
    })
    if (response) {
      const blob = await response.blob()
      return blob
    }
  } else {
    var text = await dm.getAssetText(element)
    if (text) return text
    var time = await dm.getAssetTime(element)
    if (time) return time
  }
}
export default fetchAFile
