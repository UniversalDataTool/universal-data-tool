export default (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  const id = match && match[2].length === 11 ? match[2] : null

  if (!id) return null

  return `https://youtube.com/embed/${id}`
}
