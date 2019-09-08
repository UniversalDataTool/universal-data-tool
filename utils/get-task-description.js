export default function getTaskDescription(taskDataItem) {
  var description = taskDataItem.description,
      imageUrl = taskDataItem.imageUrl,
      url = taskDataItem.url,
      pdfUrl = taskDataItem.pdfUrl;
  if (description) return description;
  if (imageUrl) return "![".concat(imageUrl, "](").concat(imageUrl, ")");
  if (pdfUrl) return "[PDF Link](".concat(pdfUrl, ")") + "<object data=\"".concat(pdfUrl.replace("http://", "https://"), "\" type=\"application/pdf\" width=\"100%\" height=\"600px\"></object>");
  if (url) return "Use this [Link](".concat(url, ")");
  return null;
}