import JAC from "jac-format"

const alternativeSpellings = {
  imageUrl: [
    "image_url",
    "image_urls",
    "image",
    "image_src",
    "img_url",
    "img",
    "img_src",
  ],
  document: ["text"],
}
const badSpellingMap = {}
for (const [correct, badSpellings] of Object.entries(alternativeSpellings)) {
  for (const badSpelling of badSpellings) {
    badSpellingMap[badSpelling] = correct
  }
}

const convertTaskDatumMistakes = (sample) => {
  for (const key in sample) {
    const normalizedKey = key.toLowerCase().replace(/ /g, "_")
    const correction = badSpellingMap[normalizedKey]
    if (correction) {
      sample[correction] = sample[key]
      delete sample[key]
    }
  }
  return sample
}

export default (csv) => {
  const json = JAC.fromCSV(csv, { derivePath: () => "samples.*" })
  if (!json.samples) throw new Error("No samples")
  return {
    interface: json.interface,
    taskOutput: json.samples.map((sample) => sample.output),
    samples: json.samples.map(convertTaskDatumMistakes).map((sample) => {
      delete sample.output
      return sample
    }),
  }
}
