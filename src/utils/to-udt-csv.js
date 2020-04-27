import JAC from "jac-format"
import range from "lodash/range"
import { flatten } from "flat"

export default (obj) => {
  const samplesObj = {}

  // Convert to single samples array
  samplesObj.interface = obj.interface
  samplesObj.samples = obj.taskData.map((td, i) => ({
    ...td,
    output: (obj.taskOutput || [])[i],
  }))

  const AddSamplesKeys = (k) => {
    sampleKeys.add(k)
  }

  // Find all possible sample keys
  let sampleKeys = new Set()
  for (const sample of samplesObj.samples) {
    Object.keys(flatten(sample)).forEach((k) => AddSamplesKeys(k))
  }
  sampleKeys = Array.from(sampleKeys).sort(
    (a, b) => a.split(".").length - b.split(".").length
  )

  if (sampleKeys.some((k) => k.includes("output.keyframes"))) {
    sampleKeys = sampleKeys.filter((k) => k.includes("output.keyframes"))
    sampleKeys.push("output.keyframes")
  }

  const options = {
    rows: [
      "interface",
      ...range(samplesObj.samples.length).map((i) => `samples.${i}`),
    ],
    columns: [".", ...sampleKeys],
  }

  return JAC.toCSV(samplesObj, options)
}
