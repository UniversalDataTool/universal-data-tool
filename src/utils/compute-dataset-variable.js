export default (dataset, varName) => {
  let fields = (dataset.interface || {}).fields || []
  // const totalLabels = fields.reduce(
  //   (acc, f) =>
  //     f.interface.type !== "data_entry"
  //       ? acc
  //       : acc + (f.interface.surveyjs.questions[0].choices || []).length,
  //   0
  // )
  // const totalBoundingBoxes = fields.filter(
  //   (f) => f.interface.type === "image_segmentation"
  // ).length

  switch (varName) {
    case "sample_count":
    case "num_samples":
      return (dataset.samples || []).length
    case "number_of_fields":
      return Object.keys(dataset.interface.fields || {}).length
    case "text_field_count":
      if (dataset.interface.type === "data_entry") {
        return dataset.interface.surveyjs.questions.filter(
          (q) => q.type === "text"
        ).length
      } else if (dataset.interface.type === "composite") {
        return fields.filter(
          (f) =>
            f.interface.type === "data_entry" &&
            f.interface.surveyjs.questions[0].type === "text"
        ).length
      } else {
        throw new Error(
          "Couldn't compute text_field_count for interface: " +
            dataset.interface.type
        )
      }
    case "number_of_classifications":
      return dataset.interface.labels.length
    case "average_number_of_interactions_per_image":
      // find completed samples
      const completedSamples = dataset.samples.filter((s) => s.annotation)
      let totalInteractions = 0
      let totalSamplesConsidered = 0
      for (const { annotation } of completedSamples) {
        if (totalSamplesConsidered > 10) break
        if (typeof annotation === "object" && annotation.length) {
          totalSamplesConsidered += 1
          for (const { points } of annotation) {
            if (points) {
              totalInteractions += points.length
            } else {
              totalInteractions += 1
            }
          }
        }
      }
      if (totalSamplesConsidered < 1)
        throw new Error(
          "Not enough completed samples to compute average_number_of_interactions_per_image"
        )
      return totalInteractions / totalSamplesConsidered
    case "number_of_exclusive_classifications":
      return dataset.interface.multiple ? 0 : dataset.interface.labels.length
    case "number_of_nonexclusive_classifications":
      return dataset.interface.multiple ? dataset.interface.labels.length : 0
    case "average_text_length":
      return (
        dataset.samples
          .map((s) => s.document.length)
          .reduce((acc, l) => acc + l, 0) / dataset.samples.length
      )
    case "number_of_labels":
      return dataset.interface.labels.length
    default:
      throw new Error(`Don't know how to compute "${varName}"`)
  }
}
