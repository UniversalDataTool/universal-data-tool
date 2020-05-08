export default function getTaskDescription(samplesItem) {
  const { description, imageUrl, url, pdfUrl } = samplesItem
  if (description) return description
  if (imageUrl) return `![${imageUrl}](${imageUrl})`
  if (pdfUrl)
    return (
      `[PDF Link](${pdfUrl})` +
      `<object data="${pdfUrl.replace(
        "http://",
        "https://"
      )}" type="application/pdf" width="100%" height="600px"></object>`
    )
  if (url) return `Use this [Link](${url})`
  return null
}
