// @flow weak

export default (changeLog) => {
  const humanReadableChangeLog = []
  for (const { userName, op, path } of changeLog) {
    if (path.startsWith("/interface")) {
      humanReadableChangeLog.push({
        type: "warning",
        message: `${userName} changed the project settings`,
      })
    } else if (path.startsWith("/taskOutput")) {
      const sampleMatch = path.match(/\/samples\/([^/]+)/)
      humanReadableChangeLog.push({
        type: "info",
        message: `${userName} changed sample ${sampleMatch[1]}`,
      })
    } else {
      humanReadableChangeLog.push({
        message: `${userName} did a ${op} at ${path}`,
        type: "info",
      })
    }
  }
  return humanReadableChangeLog
}
