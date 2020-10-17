export default () => {
  if (window.require) {
    return Boolean(window.require("electron"))
  }
  return false
}
