const splitURLsFromTextArea = (stringURLs) => {
  const urlsHasHTTPS = []
  const splittedURLsByNewLines = stringURLs.split("\n")
  for (const url of splittedURLsByNewLines) {
    if (url.includes("https://")) {
      urlsHasHTTPS.push(url)
    }
  }
  return urlsHasHTTPS
}

export default splitURLsFromTextArea
