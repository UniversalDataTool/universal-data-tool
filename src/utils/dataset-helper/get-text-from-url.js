export default async (urlSource) => {
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
