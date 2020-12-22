const fetchAFile= async (element,configExport,dm) =>{
    var response
    var url
    if (dm.getSampleUrl(element) === undefined) return
    
    url = configExport.proxyUrl + dm.getSampleUrl(element)
    response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "xmlhttprequest",
      },
    }).catch((error) => {
      console.log("Looks like there was a problem: \n", error)
    })
    const blob = await response.blob()
    return blob
  }
const createAssets = async  (dataset,configExport,dm) => {
    await Promise.all(
        dataset.samples.map(async (sample) => {
            var blob = await fetchAFile(sample,configExport,dm)
            if(!blob)return
            await dm.addAsset(dm.getSampleName(sample),blob)
        })
    )
  }
  export default createAssets