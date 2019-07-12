export default function getTaskDescription(taskDataItem) {
  const { description, imageUrl, url, pdfUrl } = taskDataItem
  if (description) return description
  if (imageUrl) return `![${imageUrl}](${imageUrl})`
  if (pdfUrl) return `Use this [PDF Link](${pdfUrl})`
  if (url) return `Use this [Link](${url})`
  return null
}
