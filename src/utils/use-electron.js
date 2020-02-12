// @flow

export default () => {
  if (window.require) {
    return window.require("electron")
  }
  return null
}
